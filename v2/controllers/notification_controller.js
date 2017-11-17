
const async = require("async");
const moment = require('moment');

const VccResponse = require(appRoot+'/common/vcc_response');
const VccSns = require(appRoot+'/lib/sns/vcc_sns');
const Utility = require(appRoot+'/common/utility');
const IOSPayload = require(appRoot+'/common/ios_payload');
const AndroidPayload = require(appRoot+'/common/android_payload');
const Logger = require(appRoot+'/common/logger');
const CsvAnalytics = require(appRoot+'/common/csv_analytics');

const vincompassController = require('../controllers/vincompass_controller');
const csvAnalyticController = require('../controllers/csv_analytic_controller');

const config    = require(appRoot+"/app_config.js");
const constants = require(global.appRoot+'/common/constants');

const models = require("../models");

module.exports = {
    createArn:function(request,response){
        var vccResponse = new VccResponse(response);
        var vccSns = new VccSns();
        var platformArn = null;
        var mobilePlatform = null;

        if(Utility.getDeviceTypeFromUserAgent(request) === constants.DEVICE_TYPE.IPHONE){
            platformArn = config.ENV_CONFIG.AWS_APP_ARN.IOS;
            mobilePlatform = constants.MOBILE_PLATFORM_TYPE.IOS;
        }else{
            platformArn = config.ENV_CONFIG.AWS_APP_ARN.ANDROID;
            mobilePlatform = constants.MOBILE_PLATFORM_TYPE.ANDROID;
        }

        async.waterfall([
            function (callback) {
                models.CustomerDeviceTokens.findOne({
                    where:{
                        device_token:request.body.device_token
                    }
                }).then(function (customerDeviceToken) {
                    callback(null,customerDeviceToken);
                }).catch(models.sequelize.Error,function (error) {
                    callback(error);
                })
            },
            function (customerDeviceToken, callback) {
                if(customerDeviceToken){
                    if(customerDeviceToken.email !== request.token.email){
                        vccSns.setEndPointAttribute({
                            CustomUserData:request.token.email
                        },customerDeviceToken.device_arn,function (error, data) {
                            if(error){
                                callback(error);
                            }else{
                                customerDeviceToken.update({
                                    customer_email:request.token.email,
                                    enable:true,
                                    updated_date:moment.utc()
                                },{
                                    fields:[
                                        "customer_email",
                                        "enable",
                                        "updated_date"
                                    ]
                                }).then(function () {
                                    callback(null,true,customerDeviceToken);
                                }).catch(models.sequelize.Error,function (error) {
                                    callback(error);
                                })
                            }
                        });
                    }else{
                        callback(null,true,customerDeviceToken);
                    }
                }else{
                    callback(null,false,null);
                }
            },
            function (deviceTokenExist, customerDeviceToken, callback) {
                if(deviceTokenExist){
                    callback(null,customerDeviceToken.device_arn,customerDeviceToken,false);
                }else{
                    vccSns.createEndPointForApp(platformArn,request.body.device_token,request.token.email,function(error,data){
                        if(error){
                            if(error.code === "InvalidParameter"){
                                var halfArn = platformArn.replace(":app",":endpoint");
                                var indexOf = error.message.indexOf(halfArn);
                                var deviceArn = error.message.substr(indexOf,halfArn.length + 37);

                                vccSns.setEndPointAttribute({CustomUserData:request.token.email},deviceArn,function (error, data) {
                                    if(error){
                                        callback(error);
                                    }else{
                                        callback(null,deviceArn,customerDeviceToken,true);
                                    }
                                });
                            }else{
                                callback(error);
                            }
                        }else{
                            callback(null,data.EndpointArn,customerDeviceToken,true);
                        }
                    });
                }
            },
            function (deviceArn, customerDeviceToken, shouldInsertIntoDb, callback) {
                if(shouldInsertIntoDb){
                    var addDate = moment.utc();

                    models.CustomerDeviceTokens.create({
                        device_token:request.body.device_token,
                        device_arn:deviceArn,
                        platform:mobilePlatform,
                        customer_email:request.token.email,
                        enable:true,
                        created_date:addDate,
                        updated_date:addDate
                    }).then(function (newCustomerDeviceToken) {
                        callback(null);
                    }).catch(models.sequelize.Error,function (error) {
                        callback(error);
                    });
                }else{
                    callback(null);
                }
            }
        ],function (error, result) {
            if(error){
                console.log(error);
                Logger.logDbError(error,request);

                vccResponse.setStatusCode(VccResponse.DATABASE_ERROR).send();
            }else{
                vccResponse.setStatusCode(VccResponse.SUCCESS_CODE).send();
            }
        });
    },
    createSelectWineNotification:function (request, response) {
        var vccResponse = new VccResponse(response);

        async.waterfall([
            function (callback) {
                var columns = [
                    "restaurants.name",
                    "noti_delay_group.delay"
                ];

                var query = "SELECT " +
                    columns.join(", ")+ " " +
                    "FROM restaurants " +
                    "INNER JOIN noti_delay_group ON noti_delay_group.id = restaurants.noti_delay_group_id " +
                    "WHERE restaurants.id=:restaurant_id";

                models.sequelize.query(query,
                    {
                        replacements:{
                            restaurant_id:request.body.restaurant_id
                        },
                        type: models.Sequelize.QueryTypes.SELECT
                    }
                ).then(function (restaurantList) {
                    callback(null,restaurantList);
                }).catch(models.sequelize.Error,function (error) {
                    callback(error);
                })
            },
            function (restaurantList, callback) {
                if(Utility.isNull(restaurantList) === false && restaurantList.length>0){
                    models.CustomerDeviceTokens.findOne({
                        where:{
                            device_token:request.body.device_token
                        }
                    }).then(function (customerDeviceToken) {
                        callback(null,{restaurantList:restaurantList,device_arn:customerDeviceToken.device_arn});
                    }).catch(models.sequelize.Error,function (error) {
                        callback(error);
                    })
                }else{
                    callback(null,{restaurantList:restaurantList});
                }
            }
        ],function (error, results) {
            if(error){
                Logger.logDbError(error,request);

                vccResponse.setStatusCode(VccResponse.DATABASE_ERROR).send();
            }else{
                if(Utility.isNull(results.restaurantList) === false && results.restaurantList.length>0){
                    if(Utility.isNull(results.device_arn) === false){
                        var restaurant = results.restaurantList[0];
                        var scheduleTime = moment().utc().add(restaurant["delay"],'m');
                        // var scheduleTime = moment().utc().add(2,'m');
                        var addDate = moment.utc();

                        var customData = {
                            wine_id:request.body.wine_id,
                            restaurant_id:request.body.restaurant_id,
                            wine_name:request.body.wine_name,
                            restaurant_name:restaurant.name,
                            vintage:request.body.vintage,
                            customer_email:request.token.email,
                            notification_type:constants.NOTIFICATION_TYPE.SELECT_WINE
                        };

                        if(Utility.isNull(request.body.food_category) === false){
                            customData.food_category = request.body.food_category;
                        }

                        if(Utility.isNull(request.body.food_name) === false){
                            customData.food_name = request.body.food_name;
                        }

                        if(Utility.isNull(request.body.image_path) === false){
                            customData.image_path = request.body.image_path;
                        }

                        var payload = null;
                        var platformType = constants.MOBILE_PLATFORM_TYPE.IOS;

                        if(Utility.getDeviceTypeFromUserAgent(request) === constants.DEVICE_TYPE.ANDROID){
                            platformType = constants.MOBILE_PLATFORM_TYPE.ANDROID;
                        }

                        // if(platformType === constants.MOBILE_PLATFORM_TYPE.IOS){
                        //     payload = new IOSPayload("Update your VinPrint",{},customData);
                        // }else{
                        //     payload = new AndroidPayload("Update your VinPrint",null,customData);
                        // }

                        var notification = {
                            alert_msg:"Update your VinPrint",
                            payload:JSON.stringify(customData),
                            type:constants.NOTIFICATION_TYPE.SELECT_WINE,
                            platform_type:platformType,
                            status:constants.NOTIFICATION_STATUS.NEW,
                            device_arn:results.device_arn,
                            device_token:request.body.device_token,
                            schedule_time:scheduleTime,
                            customer_email:request.token.email,
                            customer_id:request.token.customer_id,
                            created_date:addDate,
                            updated_date:addDate
                        };

                        models.NotificationList
                            .create(notification)
                            .then(function () {
                                models.CustomerBadgeCount.findOrCreate({
                                    where:{
                                        customer_id:request.token.customer_id
                                    },
                                    defaults:{
                                        badge_count:0,
                                        customer_email:request.token.email,
                                        created_date:addDate,
                                        updated_date:addDate
                                    }
                                }).spread(function () {
                                    vccResponse.setStatusCode(VccResponse.SUCCESS_CODE).send();
                                }).catch(function (error) {
                                    Logger.logDbError(error,request);
                                    vccResponse.setStatusCode(VccResponse.SUCCESS_CODE).send();
                                });
                            })
                            .catch(models.sequelize.Error,function (error) {
                                Logger.logDbError(error,request);

                                vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                                    .send();
                            })

                        // var count = 2;
                        //
                        // var notificationArray = [];
                        // var dateTime  = moment().utc().subtract(count,'m');
                        // var payloadContent = payload.getPayloadInStr();
                        //
                        // console.log("Current Date Time : "+moment().utc());
                        // console.log("Date Time : "+dateTime);
                        //
                        // for(var i=0;i<count;i++){
                        //     var sheduleTimeTemp  = moment(dateTime).add((count-i),'m');
                        //
                        //     notificationArray.push({
                        //         payload:payloadContent,
                        //         type:constants.NOTIFICATION_TYPE.SELECT_WINE,
                        //         platform_type:platformType,
                        //         status:constants.NOTIFICATION_STATUS.NEW,
                        //         device_arn:results.device_arn,
                        //         device_token:request.body.device_token,
                        //         schedule_time:sheduleTimeTemp,
                        //         customer_email:request.token.email,
                        //         created_date:addDate,
                        //         updated_date:addDate
                        //     });
                        // }

                        // dateTime  = moment().utc().add(2,'m');
                        // for(i=0;i<count;i++){
                        //     sheduleTimeTemp  = moment(dateTime).add(i,'m');
                        //
                        //     notificationArray.push({
                        //         payload:payloadContent,
                        //         type:constants.NOTIFICATION_TYPE.SELECT_WINE,
                        //         platform_type:platformType,
                        //         status:constants.NOTIFICATION_STATUS.NEW,
                        //         device_arn:results.device_arn,
                        //         device_token:request.body.device_token,
                        //         schedule_time:sheduleTimeTemp,
                        //         customer_email:request.token.email,
                        //         created_date:addDate,
                        //         updated_date:addDate
                        //     });
                        // }

                        // console.log(notificationArray);

                        // models.NotificationList
                        //     .bulkCreate(notificationArray)
                        //     .then(function () {
                        //         vccResponse.setStatusCode(VccResponse.SUCCESS_CODE).send();
                        //     })
                        //     .catch(models.sequelize.Error,function (error) {
                        //         console.log(error);
                        //     })
                    }else{
                        vccResponse.setStatusCode(VccResponse.RECORD_NOT_EXIST)
                            .setResponseBody({error:constants.ERROR_MESSAGES.DEVICE_TOKEN_NOT_FOUND})
                            .send();
                    }
                }else{
                    vccResponse.setStatusCode(VccResponse.RECORD_NOT_EXIST)
                        .setResponseBody({error:constants.ERROR_MESSAGES.RESTAURANT_NOT_FOUND})
                        .send();
                }
            }
        });
    },
    sendNotification:function () {
        if(global.enableNotification){
            global.enableNotification = false;

            var shouldEndProcess = false;
            var vccSns = new VccSns();

            async.whilst(
                function () {
                    return shouldEndProcess === false;
                },
                function (whilstCallback) {
                    var currentDate = moment().utc().format("YYYY-MM-DD HH:mm");
                    var wineSelectionNotificationCSVArray = [];
                    var customerNotificationArray = [];

                    async.waterfall([
                        function (callback) {
                            models.NotificationList.update({
                                status:constants.NOTIFICATION_STATUS.IN_PROGRESS
                            },{
                                fields:[
                                    "status"
                                ],
                                where:{
                                    status:constants.NOTIFICATION_STATUS.NEW,
                                    $and:[
                                        models.Sequelize.where(models.Sequelize.fn('date_format', models.Sequelize.col('schedule_time'),'%Y-%m-%d %H:%i'), {$lte:currentDate})
                                    ]
                                }
                            }).then(function (result) {
                                callback(null,result);
                            }).catch(models.sequelize.Error,function (error) {
                                Logger.logNotiError(error);
                                callback(null,0);
                            });
                        },
                        function (updatedRecordCount, callback) {
                            if(updatedRecordCount>0){
                                var columns = [
                                    "notification_list.id",
                                    "notification_list.payload",
                                    "notification_list.device_arn",
                                    "notification_list.customer_email AS to_email",
                                    "notification_list.customer_id",
                                    "notification_list.platform_type",
                                    "notification_list.type",
                                    "notification_list.alert_msg",
                                    "customer_device_tokens.enable",
                                    "customer_device_tokens.customer_email"
                                ];

                                var query = "SELECT " +
                                        columns.join(", ")+ " " +
                                    "FROM notification_list " +
                                    "INNER JOIN customer_device_tokens ON notification_list.device_token=customer_device_tokens.device_token " +
                                    "WHERE DATE_FORMAT(schedule_time,'%Y-%m-%d %H:%i') <= :schedule_time AND status = :status";

                                models.sequelize.query(query,
                                    {
                                        replacements:{
                                            schedule_time:currentDate,
                                            status:constants.NOTIFICATION_STATUS.IN_PROGRESS
                                        },
                                        type: models.Sequelize.QueryTypes.SELECT
                                    }
                                ).then(function (notifications) {
                                    var notificationIds = [];

                                    var i=0;
                                    var messageResultArray = [];

                                    async.whilst(
                                        function () {
                                            return i < notifications.length;
                                        },
                                        function (notificationLoopCallback) {
                                            var notificationObj = notifications[i];
                                            notificationIds.push(notificationObj.id);

                                            if(notificationObj.enable === 1 && notificationObj.customer_email === notificationObj.to_email){
                                                var notificationDetails = JSON.parse(notificationObj.payload);

                                                var sendNotificationMessage = function (notificationDetails,customerBadgeCount,incrementedCount) {
                                                    var payload = null;
                                                    var message = null;

                                                    notificationDetails.notification_id = notificationObj.id;

                                                    if(notificationObj.platform_type === constants.MOBILE_PLATFORM_TYPE.IOS){
                                                        payload = new IOSPayload(notificationObj.alert_msg,{badge:incrementedCount},notificationDetails);
                                                    }else if(notificationObj.platform_type === constants.MOBILE_PLATFORM_TYPE.ANDROID){
                                                        payload = new AndroidPayload(notificationObj.alert_msg,{badge:incrementedCount},notificationDetails);
                                                    }

                                                    message = payload.getPayloadInStr();

                                                    vccSns.publish({
                                                        Message:message,
                                                        MessageStructure:'json',
                                                        TargetArn:notificationObj.device_arn
                                                    },function (error, data) {
                                                        if(error){
                                                            messageResultArray.push({
                                                                notification_list_id:notificationObj.id,
                                                                payload:message,
                                                                error:error.message,
                                                                created_date:moment.utc()
                                                            });

                                                            notificationLoopCallback(null);
                                                        }else{
                                                            wineSelectionNotificationCSVArray.push({
                                                                notification_id:notificationObj.id,
                                                                customer_id:notificationObj.customer_id,
                                                                type:notificationObj.type,
                                                                wine_id:notificationDetails.wine_id,
                                                                wine_name:notificationDetails.wine_name,
                                                                food_category:(Utility.isNull(notificationDetails.food_category) === false?notificationDetails.food_category:""),
                                                                food_name:(Utility.isNull(notificationDetails.food_name) === false?notificationDetails.food_name:""),
                                                                sent_datetime:moment().utc().format("MM/DD/YYYY HH:mm:ss"),
                                                                date_time:moment().utc().format("MM/DD/YYYY HH:mm:ss"),
                                                                device_type:notificationObj.platform_type
                                                            });

                                                            var addDate = moment.utc();
                                                            customerNotificationArray.push({
                                                                notification_id:notificationObj.id,
                                                                subject:notificationObj.alert_msg,
                                                                message:notificationObj.payload,
                                                                is_read:0,
                                                                customer_id:notificationObj.customer_id,
                                                                created_date:addDate,
                                                                updated_date:addDate
                                                            });

                                                            if(customerBadgeCount){
                                                                customerBadgeCount.update(
                                                                    {
                                                                        badge_count:incrementedCount,
                                                                        updated_date:addDate
                                                                    },
                                                                    {
                                                                        fields:[
                                                                            "badge_count",
                                                                            "updated_date"
                                                                        ]
                                                                    }
                                                                ).then(function () {
                                                                    messageResultArray.push({
                                                                        notification_list_id:notificationObj.id,
                                                                        message_id:data.MessageId,
                                                                        payload:message,
                                                                        created_date:moment.utc()
                                                                    });

                                                                    notificationLoopCallback(null);
                                                                }).catch(function (error) {
                                                                    Logger.logNotiError(error);
                                                                    messageResultArray.push({
                                                                        notification_list_id:notificationObj.id,
                                                                        message_id:data.MessageId,
                                                                        payload:message,
                                                                        created_date:moment.utc()
                                                                    });

                                                                    notificationLoopCallback(null);
                                                                });
                                                            }else{
                                                                messageResultArray.push({
                                                                    notification_list_id:notificationObj.id,
                                                                    message_id:data.MessageId,
                                                                    payload:message,
                                                                    created_date:moment.utc()
                                                                });

                                                                notificationLoopCallback(null);
                                                            }
                                                        }
                                                    })
                                                };

                                                models.CustomerBadgeCount.findOne({
                                                    where:{
                                                        customer_id:notificationObj.customer_id
                                                    }
                                                }).then(function (customerBadgeCount) {
                                                    var incrementedCount = customerBadgeCount.badge_count + 1;
                                                    sendNotificationMessage(notificationDetails,customerBadgeCount,incrementedCount);

                                                }).catch(function (error) {
                                                    sendNotificationMessage(notificationDetails,null,0);
                                                });

                                                i++;
                                            }
                                        },
                                        function (error, results) {
                                            async.parallel([
                                                function (callback) {
                                                    models.NotificationList.update({
                                                        status:constants.NOTIFICATION_STATUS.SENT,
                                                        updated_date:moment.utc()
                                                    },{
                                                        fields:[
                                                            "status",
                                                            "updated_date"
                                                        ],
                                                        where:{
                                                            id:{
                                                                $in:notificationIds
                                                            }
                                                        }
                                                    }).then(function () {
                                                        callback(null);
                                                    }).catch(models.sequelize.Error,function (error) {
                                                        Logger.logNotiError(error);
                                                        callback(null);
                                                    });
                                                },
                                                function (callback) {
                                                    models.NotificationResults.bulkCreate(messageResultArray)
                                                        .then(function () {
                                                            callback(null);
                                                        }).catch(models.sequelize.Error,function (error) {
                                                        Logger.logNotiError(error);
                                                        callback(null);
                                                    })
                                                },
                                                function (callback) {
                                                    models.CustomerNotificationList.bulkCreate(customerNotificationArray)
                                                        .then(function () {
                                                            callback(null);
                                                        }).catch(function (error) {
                                                        Logger.logNotiError(error);
                                                        callback(null);
                                                    });
                                                }
                                            ],function (error, results) {
                                                CsvAnalytics.sharedInstance().writeToFile(JSON.stringify(wineSelectionNotificationCSVArray),constants.ANALYTIC_TYPES.WINE_SELECTION_NOTIFICATION);
                                                callback(null,updatedRecordCount);
                                            });
                                        }
                                    );

                                    // async.series(functionArray,function (error, results) {
                                    //     async.parallel([
                                    //         function (callback) {
                                    //             models.NotificationList.update({
                                    //                 status:constants.NOTIFICATION_STATUS.SENT,
                                    //                 updated_date:moment.utc()
                                    //             },{
                                    //                 fields:[
                                    //                     "status",
                                    //                     "updated_date"
                                    //                 ],
                                    //                 where:{
                                    //                     id:{
                                    //                         $in:notificationIds
                                    //                     }
                                    //                 }
                                    //             }).then(function () {
                                    //                 callback(null);
                                    //             }).catch(models.sequelize.Error,function (error) {
                                    //                 Logger.logNotiError(error);
                                    //                 callback(null);
                                    //             });
                                    //         },
                                    //         function (callback) {
                                    //             models.NotificationResults.bulkCreate(results)
                                    //                 .then(function () {
                                    //                     callback(null);
                                    //                 }).catch(models.sequelize.Error,function (error) {
                                    //                 Logger.logNotiError(error);
                                    //                 callback(null);
                                    //             })
                                    //         },
                                    //         function (callback) {
                                    //             models.CustomerMessageList.bulkCreate(customerMessageArray)
                                    //                 .then(function () {
                                    //                     callback(null);
                                    //                 }).catch(function (error) {
                                    //                 Logger.logNotiError(error);
                                    //                 callback(null);
                                    //             });
                                    //         }
                                    //     ],function (error, results) {
                                    //         CsvAnalytics.sharedInstance().writeToFile(JSON.stringify(wineSelectionNotificationCSVArray),constants.ANALYTIC_TYPES.WINE_SELECTION_NOTIFICATION);
                                    //         callback(null,updatedRecordCount);
                                    //     });
                                    // });
                                }).catch(models.sequelize.Error,function (error) {
                                    Logger.logNotiError(error);
                                    callback(null,updatedRecordCount);
                                });
                            }else{
                                callback(null,updatedRecordCount);
                            }
                        }
                    ],function (error,results) {
                        currentDate = moment().utc().format("YYYY-MM-DD HH:mm");

                        models.NotificationList.count({
                            where:{
                                status:constants.NOTIFICATION_STATUS.NEW,
                                $and:[
                                    models.Sequelize.where(models.Sequelize.fn('date_format', models.Sequelize.col('schedule_time'),'%Y-%m-%d %H:%i'), {$lte:currentDate})
                                ]
                            }
                        }).then(function (count) {
                            if(count<=0){
                                shouldEndProcess = true;
                            }

                            whilstCallback(null);
                        }).catch(models.sequelize.Error,function (error) {
                            shouldEndProcess = true;
                            whilstCallback(null);
                        });
                    });
                },
                function (err) {
                    if(err){
                        Logger.logNotiError(err);
                    }

                    global.enableNotification = true;
                }
            );
        }
    },
    foodWinePairingRate:function (request, response) {
        var vccResponse = new VccResponse(response);
        var addDate = moment.utc();

        models.RatingMenu.findOrCreate({
            where:{
                customer_id:request.token.customer_id,
                wine_id:request.body.wine_id
            },
            defaults:{
                customer_id:request.token.customer_id,
                wine_id:request.body.wine_id,
                rate:request.body.wine_rate,
                web:(Utility.getDeviceTypeFromUserAgent(request) === constants.DEVICE_TYPE.WEB)?1:0,
                date:addDate
            }

        }).spread(function (ratingMenu, created) {
            if(!created){
                ratingMenu.update(
                    {
                        rate:request.body.wine_rate,
                        web:1,
                        date:addDate
                    },
                    {
                        fields:[
                            "rate",
                            "web",
                            "date"
                        ]
                    }
                ).then(function () {
                    csvAnalyticController.trackFoodWinePairing(request,response);
                }).catch(models.sequelize.Error,function (error) {
                    Logger.logDbError(error,request);

                    vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                        .send();
                });
            }else{
                vincompassController.addGamificationPoint(constants.GAMIFICATION_EVENT_TYPE.WINE_RATED,[request.body.wine_id],request.token.customer_id,request,function () {
                    csvAnalyticController.trackFoodWinePairing(request,response);
                });
            }
        }).catch(models.sequelize.Error,function (error) {
            Logger.logDbError(error,request);

            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    },

    getNotificationList:function (request, response) {
        var vccResponse = new VccResponse(response);

        models.CustomerNotificationList.findAll({
            attributes:[
                "notification_id",
                "subject",
                "message",
                "is_read",
                "created_date",
                "updated_date"
            ],
            where:{
                customer_id:request.token.customer_id
            }
        }).then(function (messageList) {
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({message_list:messageList})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR).send();
        });
    },

    notificationRead:function (request, response) {
        var vccResponse = new VccResponse(response);

        models.CustomerNotificationList.findOne({
            where:{
                notification_id:request.params.notification_id
            }
        }).then(function (customerMessage) {
            if(customerMessage){
                if(customerMessage.is_read === 0){
                    customerMessage.update(
                        {
                            is_read:1,
                            updated_date:moment.utc()
                        },
                        {
                            fields:[
                                "is_read",
                                "updated_date"
                            ]
                        }
                    ).then(function () {
                        models.CustomerBadgeCount.findOne({
                            where:{
                                customer_id:request.token.customer_id
                            }
                        }).then(function (customerBadgeCount) {
                            return customerBadgeCount.update(
                                {
                                    badge_count:customerBadgeCount.badge_count - 1,
                                    updated_date:moment.utc()
                                },
                                {
                                    fields:[
                                        "badge_count",
                                        "updated_date"
                                    ]
                                }
                            );
                        }).then(function () {
                            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE).send();
                        }).catch(function (error) {
                            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE).send();
                        });
                    }).catch(function (error) {
                        Logger.logDbError(error,request);
                        vccResponse.setStatusCode(VccResponse.DATABASE_ERROR).send();
                    })
                }else{
                    vccResponse.setStatusCode(VccResponse.SUCCESS_CODE).send();
                }
            }else{
                vccResponse.setStatusCode(VccResponse.RECORD_NOT_EXIST)
                    .setResponseBody({error:constants.ERROR_MESSAGES.NO_RECORD_FOUND})
                    .send();
            }
        }).catch(function (error) {
            Logger.logDbError(error,request);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR).send();
        })
    },

    deleteNotification:function (request, response) {
        var vccResponse = new VccResponse(response);

        models.sequelize.transaction(function (t) {
            return models.CustomerNotificationList.destroy({
                where:{
                    notification_id:{
                        $in:request.body.notification_ids
                    }
                }
            },{transaction:t}).then(function (deletedCount) {
                if (deletedCount > 0) {
                    return models.CustomerNotificationList.count({
                        where:{
                            customer_id:request.token.customer_id,
                            is_read:0
                        }
                    },{transaction:t}).then(function (count) {
                        return models.CustomerBadgeCount.update({
                            badge_count:count
                        },{
                            where:{
                                customer_id:request.token.customer_id
                            }
                        },{transaction:t});
                    })
                }
            });
        }).then(function (results) {
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE).send();
        }).catch(function (error) {
            Logger.logDbError(error,request);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR).send();
        });
    }
};