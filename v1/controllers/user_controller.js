/**
 * Created by ravimodha on 05/01/17.
 */

const path = require('path');
const randomstring = require("randomstring");
const moment = require('moment');
const nodemailer = require('nodemailer');
const crypto = require("crypto");
const underscore = require("underscore");
const async = require("async");
const jwt = require('jsonwebtoken');

const EmailTemplate = require('email-templates').EmailTemplate;

const models = require("../models");
const config    = require(appRoot+"/app_config.js");
const constants = require(appRoot+'/common/constants');
const vincompassController = require('../controllers/vincompass_controller');

const VccResponse = require(appRoot+'/common/vcc_response');
const Memcache = require(appRoot+'/common/memcache');
const Logger = require(appRoot+'/common/logger');
const Utility = require(appRoot+'/common/utility');

module.exports = {
    getSurveyQuestions:function (request, response) {
        getSurveyQuestions(function (surveyQuestions, error) {
            var vccResponse;

            if(!error){
                vccResponse = new VccResponse(response);
                vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                    .setResponseBody({survey_questions: surveyQuestions})
                    .send();
            }else{
                Logger.logDbError(error,request);

                vccResponse = new VccResponse(response);
                vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                    .send();
            }
        })
    },
    getArchiveDashboardCount:function (request, response) {
        var userArchiveDashboardCount = {
            vinOutCount:function (callback) {
                var query = "SELECT " +
                        "COUNT(user_archive.id) AS count " +
                    "FROM user_archive " +
                    "INNER JOIN menu ON menu.id=user_archive.menu_id AND menu.is_deleted = :is_deleted AND menu.active = :active " +
                    "INNER JOIN wines ON wines.id = user_archive.wine_id AND wines.is_deleted = :is_deleted " +
                    "INNER JOIN wines_description ON wines_description.id = wines.wine_description_id AND wines_description.is_deleted = :is_deleted " +
                    "WHERE user_archive.customer_id = :customer_id AND archive_type = :user_archive_type ";

                models.sequelize.query(query,
                    {
                        replacements:{
                            customer_id:request.token.customer_id,
                            user_archive_type:constants.USER_ARCHIVE_TYPE.VIN_OUT,
                            active:1,
                            is_deleted:0
                        },
                        type: models.Sequelize.QueryTypes.SELECT
                    }
                ).then(function (vinOutCount) {
                    if(Utility.isNull(vinOutCount) == false){
                        if(vinOutCount.length > 0){
                            callback(null,vinOutCount[0].count);
                        }else{
                            callback(null,0);
                        }
                    }else{
                        callback(null,0);
                    }
                }).catch(function (error) {
                    Logger.logDbError(error,request);
                    callback(null,0);
                });
            },
            vinInCount:function (callback) {
                var query = "SELECT " +
                    "COUNT(user_archive.id) AS count " +
                    "FROM user_archive " +
                    "INNER JOIN wines ON wines.id = user_archive.wine_id AND wines.is_deleted = :is_deleted " +
                    "INNER JOIN wines_description ON wines_description.id = wines.wine_description_id AND wines_description.is_deleted = :is_deleted " +
                    "WHERE user_archive.customer_id = :customer_id AND archive_type = :user_archive_type ";

                models.sequelize.query(query,
                    {
                        replacements:{
                            customer_id:request.token.customer_id,
                            user_archive_type:constants.USER_ARCHIVE_TYPE.VIN_IN,
                            is_deleted:0
                        },
                        type: models.Sequelize.QueryTypes.SELECT
                    }
                ).then(function (vinInCount) {
                    if(Utility.isNull(vinInCount) == false){
                        if(vinInCount.length > 0){
                            callback(null,vinInCount[0].count);
                        }else{
                            callback(null,0);
                        }
                    }else{
                        callback(null,0);
                    }
                }).catch(function (error) {
                    Logger.logDbError(error,request);
                    callback(null,0);
                });
            },
            favWinesCount:function (callback) {
                var query = "SELECT " +
                    "COUNT(user_archive.id) AS count " +
                    "FROM user_archive " +
                    "INNER JOIN wines ON wines.id = user_archive.wine_id AND wines.is_deleted = :is_deleted " +
                    "INNER JOIN wines_description ON wines_description.id = wines.wine_description_id AND wines_description.is_deleted = :is_deleted " +
                    "WHERE user_archive.customer_id = :customer_id AND archive_type = :user_archive_type ";

                models.sequelize.query(query,
                    {
                        replacements:{
                            customer_id:request.token.customer_id,
                            user_archive_type:constants.USER_ARCHIVE_TYPE.MY_FAVORITE,
                            is_deleted:0
                        },
                        type: models.Sequelize.QueryTypes.SELECT
                    }
                ).then(function (favWinesCount) {
                    if(Utility.isNull(favWinesCount) == false){
                        if(favWinesCount.length > 0){
                            callback(null,favWinesCount[0].count);
                        }else{
                            callback(null,0);
                        }
                    }else{
                        callback(null,0);
                    }
                }).catch(function (error) {
                    Logger.logDbError(error,request);
                    callback(null,0);
                });
            },
            allWinesCount:function (callback) {
                var query = "SELECT " +
                        "user_archive.id " +
                    "FROM user_archive " +
                    "INNER JOIN wines ON wines.id = user_archive.wine_id AND wines.is_deleted = :is_deleted " +
                    "INNER JOIN wines_description ON wines_description.id = wines.wine_description_id AND wines_description.is_deleted = :is_deleted " +
                    "WHERE user_archive.customer_id = :customer_id AND IS_VALID_MENU(user_archive.menu_id) = 1 " +
                    "GROUP BY user_archive.wine_id ";

                models.sequelize.query(query,
                    {
                        replacements:{
                            customer_id:request.token.customer_id,
                            is_deleted:0
                        },
                        type: models.Sequelize.QueryTypes.SELECT
                    }
                ).then(function (allWinesCount) {
                    if(Utility.isNull(allWinesCount) == false){
                        if(allWinesCount.length > 0){
                            callback(null,allWinesCount.length);
                        }else{
                            callback(null,0);
                        }
                    }else{
                        callback(null,0);
                    }
                }).catch(function (error) {
                    Logger.logDbError(error,request);
                    callback(null,0);
                });
            },
            favPlacesCount:function (callback) {
                var query = "SELECT " +
                        "COUNT(user_places.id) AS count " +
                    "FROM user_places " +
                    "INNER JOIN restaurants ON user_places.restaurant_id = restaurants.id AND restaurants.active = :active AND is_deleted = :is_deleted " +
                    "WHERE customer_id = :customer_id AND user_place_type = :user_place_type";

                models.sequelize.query(query,
                    {
                        replacements:{
                            customer_id:request.token.customer_id,
                            user_place_type:constants.USER_ARCHIVE_TYPE.MY_FAVORITE,
                            active:1,
                            is_deleted:0
                        },
                        type: models.Sequelize.QueryTypes.SELECT
                    }
                ).then(function (myPlaceCount) {
                    if(Utility.isNull(myPlaceCount) == false){
                        if(myPlaceCount.length > 0){
                            callback(null,myPlaceCount[0].count);
                        }else{
                            callback(null,0);
                        }
                    }else{
                        callback(null,0);
                    }
                }).catch(function (error) {
                    Logger.logDbError(error,request);
                    callback(null,0);
                });
            },
            restaurantsCount:function (callback) {
                var query = "SELECT " +
                        "COUNT(user_places.id) AS count " +
                    "FROM user_places " +
                    "INNER JOIN restaurants ON user_places.restaurant_id = restaurants.id AND restaurants.active = :active AND is_deleted = :is_deleted " +
                    "WHERE customer_id = :customer_id AND user_place_type = :user_place_type";

                models.sequelize.query(query,
                    {
                        replacements:{
                            customer_id:request.token.customer_id,
                            user_place_type:constants.USER_ARCHIVE_TYPE.MY_PLACE,
                            active:1,
                            is_deleted:0
                        },
                        type: models.Sequelize.QueryTypes.SELECT
                    }
                ).then(function (favRestaurantCount) {
                    if(Utility.isNull(favRestaurantCount) == false){
                        if(favRestaurantCount.length > 0){
                            callback(null,favRestaurantCount[0].count);
                        }else{
                            callback(null,0);
                        }
                    }else{
                        callback(null,0);
                    }
                }).catch(function (error) {
                    Logger.logDbError(error,request);
                    callback(null,0);
                });
            }
        };

        async.parallel(
            userArchiveDashboardCount,
            function (error,results) {
                var userArchiveDashboardDetails = {
                    vinOutCount:results.vinOutCount,
                    vinInCount:results.vinInCount,
                    favWinesCount:results.favWinesCount,
                    allWinesCount:results.allWinesCount,
                    favPlacesCount:results.favPlacesCount,
                    restaurantsCount:results.restaurantsCount
                };

                var vccResponse = new VccResponse(response);
                vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                    .setResponseBody(userArchiveDashboardDetails)
                    .send();
            }
        );
    },
    getProfile:function (request, response) {
        var userProfileCounts = {
            surveyQuestions:function (callback) {
                models.Questions.findAll({
                    attributes:[
                        ["id","question_id"],
                        "question",
                        ["type","question_type"],
                        "question_label"
                    ],
                    include:[
                        {
                            model: models.Answers,
                            as: 'answers',
                            attributes:[
                                ["id","answer_id"],
                                ["full_answer","answer"],
                                "display_order",
                                "is_default"
                            ],
                            where:{
                                survey_group:constants.SURVEY_QUESTION_GROUP
                            }
                        },
                        {
                            model:models.CustomerAnswers,
                            as:"customer_answers",
                            required:false,
                            attributes:[
                                "answer_id"
                            ],
                            where:{
                                customer_id:request.token.customer_id,
                                survey_group:constants.SURVEY_QUESTION_GROUP
                            }
                        }
                    ],
                    where:{
                        survey_group:constants.SURVEY_QUESTION_GROUP
                    },
                    order:[
                        ['number', 'ASC']
                    ]
                }).then(function (surveyQuestions) {
                    callback(null,surveyQuestions);
                }).catch(models.sequelize.Error,function (error) {
                    Logger.logDbError(error,request);
                    callback(null,null);
                });
            },
            checkIns:function (callback) {

                var query = "SELECT " +
                        "COUNT(user_places.id) AS count " +
                    "FROM user_places " +
                    "INNER JOIN restaurants ON user_places.restaurant_id = restaurants.id AND restaurants.active = :active AND is_deleted = :is_deleted " +
                    "WHERE customer_id = :customer_id AND user_place_type = :user_place_type";

                models.sequelize.query(query,
                    {
                        replacements:{
                            customer_id:request.token.customer_id,
                            user_place_type:constants.USER_ARCHIVE_TYPE.MY_PLACE,
                            active:1,
                            is_deleted:0
                        },
                        type: models.Sequelize.QueryTypes.SELECT
                    }
                ).then(function (favRestaurantCount) {
                    if(Utility.isNull(favRestaurantCount) == false){
                        if(favRestaurantCount.length > 0){
                            callback(null,favRestaurantCount[0].count);
                        }else{
                            callback(null,0);
                        }
                    }else{
                        callback(null,0);
                    }
                }).catch(models.sequelize.Error,function (error) {
                    Logger.logDbError(error,request);
                    callback(null,0);
                });
            },
            winesRated:function (callback) {
                models.RatingMenu.count({
                    where:{
                        customer_id:request.token.customer_id
                    }
                }).then(function (count) {
                    callback(null,count);
                }).catch(models.sequelize.Error,function (error) {
                    Logger.logDbError(error,request);
                    callback(null,null);
                });
            },
            userTotalPoints:function (callback) {
                models.GamificationUserPoints.findOne({
                    where:{
                        customer_id:request.token.customer_id
                    }
                }).then(function (gamificationUserPointDetail) {
                    callback(null,gamificationUserPointDetail);
                }).catch(models.sequelize.Error,function (error) {
                    Logger.logDbError(error,request);
                    callback(null,null);
                });
            }
        };

        if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.MOBILE){
            userProfileCounts.vinOutCount = function (callback) {
                var query = "SELECT " +
                        "COUNT(user_archive.id) AS count " +
                    "FROM user_archive " +
                    "INNER JOIN menu ON menu.id=user_archive.menu_id AND menu.is_deleted = :is_deleted AND menu.active = :active " +
                    "INNER JOIN wines ON wines.id = user_archive.wine_id AND wines.is_deleted = :is_deleted " +
                    "INNER JOIN wines_description ON wines_description.id = wines.wine_description_id AND wines_description.is_deleted = :is_deleted " +
                    "WHERE user_archive.customer_id = :customer_id AND archive_type = :user_archive_type ";

                models.sequelize.query(query,
                    {
                        replacements:{
                            customer_id:request.token.customer_id,
                            user_archive_type:constants.USER_ARCHIVE_TYPE.VIN_OUT,
                            active:1,
                            is_deleted:0
                        },
                        type: models.Sequelize.QueryTypes.SELECT
                    }
                ).then(function (vinOutCount) {
                    if(Utility.isNull(vinOutCount) == false){
                        if(vinOutCount.length > 0){
                            callback(null,vinOutCount[0].count);
                        }else{
                            callback(null,0);
                        }
                    }else{
                        callback(null,0);
                    }
                }).catch(function (error) {
                    Logger.logDbError(error,request);
                    callback(null,0);
                });
            };

            userProfileCounts.vinInCount = function (callback) {
                var query = "SELECT " +
                    "COUNT(user_archive.id) AS count " +
                    "FROM user_archive " +
                    "INNER JOIN wines ON wines.id = user_archive.wine_id AND wines.is_deleted = :is_deleted " +
                    "INNER JOIN wines_description ON wines_description.id = wines.wine_description_id AND wines_description.is_deleted = :is_deleted " +
                    "WHERE user_archive.customer_id = :customer_id AND archive_type = :user_archive_type ";

                models.sequelize.query(query,
                    {
                        replacements:{
                            customer_id:request.token.customer_id,
                            user_archive_type:constants.USER_ARCHIVE_TYPE.VIN_IN,
                            is_deleted:0
                        },
                        type: models.Sequelize.QueryTypes.SELECT
                    }
                ).then(function (vinInCount) {
                    if(Utility.isNull(vinInCount) == false){
                        if(vinInCount.length > 0){
                            callback(null,vinInCount[0].count);
                        }else{
                            callback(null,0);
                        }
                    }else{
                        callback(null,0);
                    }
                }).catch(function (error) {
                    Logger.logDbError(error,request);
                    callback(null,0);
                });
            };

            userProfileCounts.friendsCount = function (callback) {
                var query = "SELECT " +
                        "COUNT(customers.id) AS count " +
                    "FROM customer_invites " +
                    "INNER JOIN customers ON customer_invites.friend_id = customers.id AND customers.is_registered = :is_registered " +
                    "WHERE customer_invites.customer_id = :customer_id AND customer_invites.is_removed = :is_removed";

                models.sequelize.query(query,
                    {
                        replacements:{
                            customer_id:request.token.customer_id,
                            is_removed:0,
                            is_registered:1
                        },
                        type: models.Sequelize.QueryTypes.SELECT
                    }
                ).then(function (friendCount) {
                    if(Utility.isNull(friendCount) == false){
                        if(friendCount.length > 0){
                            callback(null,friendCount[0].count);
                        }else{
                            callback(null,0);
                        }
                    }else{
                        callback(null,0);
                    }
                }).catch(function (error) {
                    Logger.logDbError(error,request);
                    callback(null,0);
                });

                // models.CustomerInvites.count({
                //     where:{
                //         customer_id:request.token.customer_id
                //     }
                // }).then(function (count) {
                //     callback(null,count);
                // }).catch(models.sequelize.Error,function (error) {
                //     Logger.logDbError(error,request);
                //     callback(null,0);
                // })
            };

            userProfileCounts.profilePic = function (callback) {
                models.Customers.findOne(
                    {
                        where: {
                            id: request.token.customer_id
                        },
                        attributes: [
                            ["IF((ISNULL(profile_pic) OR profile_pic=''),'',CONCAT('"+path.join(constants.IMAGE_PATH.USER_PROFILE_PIC_THUMB,"/")+"',profile_pic))","profile_pic_thumb"],
                            ["IF((ISNULL(profile_pic) OR profile_pic=''),'',CONCAT('"+path.join(constants.IMAGE_PATH.USER_PROFILE_PIC_ORIGINAL,"/")+"',profile_pic))","profile_pic"],
                        ],
                        raw:true
                    }
                ).then(function (customer) {
                    callback(null,customer);
                }).catch(models.sequelize.Error,function (error) {
                    Logger.logDbError(error,request);
                    callback(null,null);
                });
            };
        }

        async.parallel(
            userProfileCounts,
            function (error, results) {
                var totalPoints = 0;

                if(results.userTotalPoints){
                    totalPoints = results.userTotalPoints.total_points;
                }

                var profileDetils = {
                    wines_rated:results.winesRated,
                    check_ins:results.checkIns,
                    survey_questions:results.surveyQuestions
                };

                profileDetils.vinprint_points = vincompassController.vinPrintPointCalculation(totalPoints);

                if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.MOBILE) {
                    profileDetils.wines_in_archived = (results.vinOutCount + results.vinInCount);
                    profileDetils.friends_count = results.friendsCount;

                    if(Utility.isNull(results.profilePic) == false){
                        profileDetils.profile_pic = results.profilePic;
                    }
                }

                var vccResponse = new VccResponse(response);
                vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                    .setResponseBody(profileDetils)
                    .send();
            }
        );
    },
    saveSurveyAnswers:function (request, response) {
        vincompassController.validateSurveyAnswers(request.body.questions,function (error,customerAnswerDetails) {
            var vccResponse = null;
            var questionsIds = [];

            if(error){
                vccResponse = new VccResponse(response);
                vccResponse.setStatusCode(error.error_code)
                    .setResponseBody({error: error.message})
                    .send();
            }else{
                var customerAnswers = customerAnswerDetails.customer_answers;
                questionsIds = customerAnswerDetails.question_ids;

                dbErrorCallback = function (error) {
                    Logger.logDbError(error,request);

                    vccResponse = new VccResponse(response);
                    vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                        .send();
                };

                var customerAnswersInsertCallback = function (idArray) {
                    var whereCondition ={};

                    if(Utility.isNull(idArray) == false && idArray.length>0){
                        whereCondition.id = {
                            $notIn:idArray
                        }
                    }

                    whereCondition.customer_id = request.token.customer_id;
                    whereCondition.question_id = {
                        $in:questionsIds
                    };

                    models.CustomerAnswers.destroy({
                        where:whereCondition
                    }).then(function () {
                        async.waterfall(
                            [
                                function (callback) {
                                    models.GamificationUserPointHistory.findAll({
                                        attributes:[
                                            "question_id"
                                        ],
                                        where:{
                                            event_type:constants.GAMIFICATION_EVENT_TYPE.QUESTIONS,
                                            customer_id:request.token.customer_id
                                        }
                                    }).then(function (questionIdList) {
                                        var questionIdArray = [];

                                        for (var i=0;i<questionIdList.length;i++){
                                            questionIdArray[i] = questionIdList[i].question_id;
                                        }

                                        callback(null,questionIdArray);
                                    }).catch(function (error) {
                                        Logger.logDbError(error,request);

                                        callback(error,null);
                                    })
                                },
                                function (questionIdArray,callback) {
                                    var insertQuestionIds = [];
                                    var counter = 0;

                                    for (var i=0;i<customerAnswerDetails.question_ids_with_answers.length;i++){
                                        var questionId = customerAnswerDetails.question_ids_with_answers[i];
                                        var recordExists = false;

                                        for (var j=0;j<questionIdArray.length;j++){
                                            if(questionIdArray[j] == questionId){
                                                recordExists = true;
                                                break;
                                            }
                                        }

                                        if(!recordExists){
                                            insertQuestionIds.push(questionId);
                                        }
                                    }

                                    vincompassController.addGamificationPoint(constants.GAMIFICATION_EVENT_TYPE.QUESTIONS,insertQuestionIds,request.token.customer_id,request,function () {
                                        callback(null,null);
                                    });
                                }
                            ],
                            function (error, results) {
                                vccResponse = new VccResponse(response);
                                vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                                    .send();
                            }
                        );
                    }).catch(function (error) {
                        dbErrorCallback(error);
                    });
                };

                if(customerAnswers.length > 0){
                    for (var i=0;i<customerAnswers.length;i++){
                        var customerAnswer = customerAnswers[i];
                        customerAnswer.customer_id = request.token.customer_id;
                    }

                    models.CustomerAnswers.bulkCreate(customerAnswers,{individualHooks: true}).then(function (customerAnswers) {
                        var idArray = [];
                        for (i=0;i<customerAnswers.length;i++){
                            idArray[i] = customerAnswers[i].id;
                        }

                        customerAnswersInsertCallback(idArray);
                    }).catch(function (error) {
                        dbErrorCallback(error);
                    });
                }else{
                    customerAnswersInsertCallback([]);
                }
            }
        });
    },
    getFriends:function (request, response) {
        var vccResponse = null;
        var columns = [
            "customers.id AS customer_id",
            "customers.first_name",
            "customers.last_name",
            "customers.email",
            "CONCAT('"+path.join(constants.IMAGE_PATH.USER_PROFILE_PIC_THUMB,"/")+"',customers.profile_pic) AS profile_pic_thumb",
            "CONCAT('"+path.join(constants.IMAGE_PATH.USER_PROFILE_PIC_ORIGINAL,"/")+"',customers.profile_pic) AS profile_pic"
        ];

        if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.WEB) {
            columns.push("(SELECT count(*) FROM rating_menu WHERE customer_id=customer_invites.friend_id) AS wines_rated");
            columns.push("(SELECT count(*) FROM user_places WHERE customer_id=customer_invites.friend_id AND user_place_type=:user_place_type) AS restaurant_visted");
            columns.push("IFNULL(gamification_user_points.total_points,0) AS vin_print_points");
        }else{
            columns.push("date_added");
        }

        var query = "SELECT " +
                columns.join(", ")+ " " +
            "FROM customer_invites " +
            "INNER JOIN customers ON customer_invites.friend_id = customers.id AND customers.is_registered = :is_registered " +
            "LEFT JOIN gamification_user_points ON customer_invites.friend_id = gamification_user_points.customer_id " +
            "WHERE customer_invites.customer_id = :customer_id AND customer_invites.is_removed = :is_removed";

        models.sequelize.query(query,
            {
                replacements:{
                    customer_id:request.token.customer_id,
                    is_removed:0,
                    is_registered:1,
                    user_place_type:constants.USER_ARCHIVE_TYPE.MY_PLACE
                },
                type: models.Sequelize.QueryTypes.SELECT
            }
        ).then(function (friendList) {
            vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({friend_list: friendList})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        })
    },
    getCheckIns:function (request, response) {
        var vccResponse = null;
        var customerId = request.token.customer_id;
        var query = "SELECT " +
                "restaurants.id as restaurant_id, " +
                "restaurants.name, " +
                "restaurants.address, " +
                "restaurants.phone, " +
                "restaurants.wine_count, " +
                "CONCAT('"+path.join(constants.IMAGE_PATH.RESTAURANT_THUMB_PATH)+"','/',restaurant_images.image) AS image_thumb, " +
                "CONCAT('"+path.join(constants.IMAGE_PATH.RESTAURANT_ORIGINAL_PATH)+"','/',restaurant_images.image) AS image, " +
                "restaurants.city, " +
                "restaurants.state_prov, " +
                "restaurants.zip, " +
                "restaurants.country, customer_check_in " +
            "FROM customer_check_in " +
            "INNER JOIN restaurants ON customer_check_in.restaurant_id = restaurants.id AND restaurants.active = :active AND is_deleted = :is_deleted " +
            "LEFT OUTER JOIN restaurant_images ON restaurants.id = restaurant_images.restaurant_id AND restaurant_images.featured_image=1  " +
            "WHERE customer_id = :customer_id";

        if(Utility.isNull(request.params) == false && Utility.isNull(request.params.customer_id) == false){
            customerId = request.params.customer_id;
        }

        models.sequelize.query(query,
            {
                replacements:{
                    customer_id:customerId,
                    active:1,
                    is_deleted:0
                },
                type:models.Sequelize.QueryTypes.SELECT
            }
        ).then(function (checkIns) {
            vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({check_ins: checkIns})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        })
    },
    setProfilePic:function (request, response) {
        var vccResponse = null;

        var dbErrorCallBack = function (error) {
            Logger.logDbError(error,request);

            Utility.removeFile(request.file.path);
            vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        };

        models.Customers.findById(request.token.customer_id)
            .then(function (customer) {
                var existFileName = customer.profile_pic;

                customer.update(
                    {
                        profile_pic:request.file.filename
                    },
                    {
                        fields:["profile_pic"]
                    }
                ).then(function () {
                    Utility.removeFile(path.join(appRoot+constants.PHYSICAL_IMAGE_PATH.USER_PROFILE_PIC_ORIGINAL,existFileName));
                    Utility.removeFile(path.join(appRoot+constants.PHYSICAL_IMAGE_PATH.USER_PROFILE_PIC_THUMB,existFileName));

                    vccResponse = new VccResponse(response);
                    vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                        .send();
                }).catch(function (error) {
                    dbErrorCallBack(error)
                });
            }).catch(function (error) {
                dbErrorCallBack(error)
        });
    },
    sendInvite:function (request, response) {
        var vccResponse = new VccResponse(response);

        var insertInviteCode = function () {
            var charset = moment().utc().unix()+"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var inviteCode = randomstring.generate({
                length:6,
                charset:charset
            });

            var addDate = moment.utc();
            var endDate = moment().utc().add(3,'M');

            var invitationCode = {
                code:inviteCode,
                name:"",
                first_name:(Utility.isNull(request.body.first_name) == false)?request.body.first_name:"",
                last_name:(Utility.isNull(request.body.last_name) == false)?request.body.last_name:"",
                email:request.body.email,
                mobile:(Utility.isNull(request.body.mobile) == false)?request.body.mobile:"",
                code_type:constants.INVITE_CODE_TYPE.FRIEND_INVITE,
                invite_medium:request.body.medium,
                created_at:addDate,
                updated_at:addDate,
                start:addDate,
                end:endDate,
                quantity:1,
                attempts:0,
                registrations:0,
                add_user_id:request.token.customer_id,
                edit_user_id:request.token.customer_id,
                active:1
            };

            models.IcServiceInvitationCode
                .create(invitationCode)
                .then(function (inviteCodeDetail) {
                    vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                        .setResponseBody({invitation_code: inviteCode,expiry_date:endDate})
                        .send();
                }).catch(function (error) {
                Logger.logDbError(error,request);

                vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                    .send();
            });
        };

        var makeFriendToExistingUser = function (invitedFriend) {

            models.CustomerInvites.count({
                where:{
                    customer_id:request.token.customer_id,
                    friend_id:invitedFriend.id
                }
            }).then(function (count) {
                if(count<=0){
                    var addDate = moment.utc();

                    var friendDetails = {
                        customer_id:request.token.customer_id,
                        friend_id:invitedFriend.id,
                        friend_email:invitedFriend.email,
                        friend_first_name:invitedFriend.first_name,
                        friend_last_name:invitedFriend.last_name,
                        date_added:addDate,
                        medium:request.body.medium,
                        influence:1,
                        friends_influence:1,
                        hash:crypto.createHash('md5').update((invitedFriend.email + moment().utc().unix())).digest("hex")
                    };

                    models.CustomerInvites
                        .create(friendDetails)
                        .then(function (friend) {
                            sendExistingUserEmails(invitedFriend);
                        }).catch(function (error) {
                        Logger.logDbError(error,request);

                        vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                            .send();
                    })
                }else{
                    vccResponse.setStatusCode(VccResponse.RECORD_EXIST)
                        .setResponseBody({error:constants.ERROR_MESSAGES.FRIEND_EXISTS})
                        .send();
                }
            }).catch(function (error) {
                Logger.logDbError(error,request);

                vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                    .send();
            });
        };

        var sendExistingUserEmails = function (invitedFriend) {
            models.Customers.findOne({
                where:{
                    id:request.token.customer_id
                }
            }).then(function (inviteCustomer) {
                var transporter = nodemailer.createTransport({
                    host: config.ENV_CONFIG.mailConfig.host,
                    port: config.ENV_CONFIG.mailConfig.port,
                    secure: config.ENV_CONFIG.mailConfig.secure, // use SSL
                    auth: {
                        user: config.ENV_CONFIG.mailConfig.username,
                        pass: config.ENV_CONFIG.mailConfig.password
                    }
                });

                async.series({
                    sendInvitedEmail:function (callback) {
                        var templateDir = path.join(appRoot, 'email_templates', 'invitation','invited');

                        var invitedTemplate = new EmailTemplate(templateDir);
                        var inviteDetail = {
                            to_user_first_name:invitedFriend.first_name,
                            from_user_full_name: (inviteCustomer.first_name + " " + inviteCustomer.last_name),
                            from_user_first_name: inviteCustomer.first_name
                        };

                        invitedTemplate.render(inviteDetail, function (err, results) {
                            if (err) {
                                console.log(err);
                                callback(null,null);
                            } else {
                                var mailOptions = {
                                    from: config.ENV_CONFIG.mailConfig.from,
                                    to: invitedFriend.email,
                                    subject: 'You’re Connected with Your Friend on Vincompass',
                                    html: results.html
                                };

                                console.log(mailOptions);

                                transporter.sendMail(mailOptions, function(error, info){
                                    if(error){
                                        console.log(error);
                                    }
                                    console.log('Message sent: ' + info.response);

                                    callback(null,null);
                                });
                            }
                        });
                    },
                    sendInviteEmail:function (callback) {
                        var templateDir = path.join(appRoot, 'email_templates','friend');

                        var inviteTemplate = new EmailTemplate(templateDir);
                        var invitedDetail = {
                            from_user_first_name:inviteCustomer.first_name,
                            to_user_full_name: (invitedFriend.first_name + " " +invitedFriend.last_name),
                            to_user_first_name: invitedFriend.first_name
                        };

                        inviteTemplate.render(invitedDetail, function (err, results) {
                            if (err) {
                                console.log(err);
                                callback(null,null);
                            } else {
                                var mailOptions = {
                                    from: config.ENV_CONFIG.mailConfig.from,
                                    to: inviteCustomer.email,
                                    subject: 'Your Friend Has Joined Vincompass',
                                    html: results.html
                                };

                                console.log(mailOptions);

                                transporter.sendMail(mailOptions, function(error, info){
                                    if(error){
                                        console.log(error);
                                    }
                                    console.log('Message sent: ' + info.response);

                                    callback(null,null);
                                });
                            }
                        });
                    }
                },function (error, results) {
                    vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                        .setResponseBody({message:constants.MESSAGE.EXISTING_USER_INVITATION})
                        .send();
                });
            });
        };

        models.Customers.findOne({
            where:{
                email:request.body.email
            }
        }).then(function (customer) {
            if(customer){
                makeFriendToExistingUser(customer);
            }else{
                insertInviteCode();
            }
        }).catch(function (error) {
            Logger.logDbError(error,request);

            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    },
    changePassword:function (request, response) {
        var vccResponse = new VccResponse(response);

        models.Customers
            .findById(request.token.customer_id)
            .then(function (userDetail) {
               var comparePassword = crypto.createHash('md5').update(request.body.old_password).digest("hex");

               if(userDetail.password == comparePassword){
                   userDetail.update(
                       {
                           password:crypto.createHash('md5').update(request.body.new_password).digest("hex")
                       },
                       {
                           fields:[
                               "password"
                           ]
                       }
                   ).then(function () {
                       var tokenExpired = moment().utc().add(3,'M').unix();
                       var token = jwt.sign({email: userDetail.email, customer_id: userDetail.id, token_expire: tokenExpired},constants.TOKEN_ENCRYPTION_KEY);

                       Memcache.sharedInstance()
                           .getMemcachePlus()
                           .get(userDetail.email)
                           .then(function (userTokenArray) {
                               userTokenArray.length = 0;
                               userTokenArray.push(token);

                               Memcache.sharedInstance()
                                   .getMemcachePlus()
                                   .replace(userDetail.email,userTokenArray)
                                   .then(function () {
                                       vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                                           .setResponseBody({token:token,token_expired:tokenExpired})
                                           .send();
                                   }).catch(function (error) {
                                       vccResponse.setStatusCode(VccResponse.UNKNOWN_ERROR)
                                           .send();
                                   });
                           }).catch(function (error) {
                               vccResponse.setStatusCode(VccResponse.UNKNOWN_ERROR)
                                   .send();
                           });
                   }).catch(function (error) {
                       Logger.logDbError(error,request);

                       vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                           .send();
                   })
               }else{
                   vccResponse.setStatusCode(VccResponse.INVALID_PASSWORD)
                       .setResponseBody({error:constants.ERROR_MESSAGES.INVALID_OLD_PASSWORD})
                       .send();
               }
            }).catch(function (error) {
                Logger.logDbError(error,request);

                vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                    .send();
        });
    },
    saveProfile:function (request, response) {
        var vccResponse = null;

        var isProfilePicSet = false;

        if(request.file){
            isProfilePicSet = true;
        }

        var dbErrorCallBack = function (error) {
            Logger.logDbError(error,request);

            if(isProfilePicSet){
                Utility.removeFile(request.file.path);
            }

            vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        };

        models.Customers.findById(request.token.customer_id)
            .then(function (customer) {
                var updateFieldValues = {};
                var updateFields = [];

                updateFieldValues.address = request.body.address;
                updateFieldValues.latitude = request.body.latitude;
                updateFieldValues.longitude = request.body.longitude;
                updateFields.push("address");
                updateFields.push("latitude");
                updateFields.push("longitude");

                if(isProfilePicSet){
                    updateFieldValues.profile_pic = request.file.filename;
                    updateFields.push("profile_pic");
                }

                var existFileName = customer.profile_pic;

                customer.update(
                    updateFieldValues,
                    updateFields
                ).then(function () {
                    if(isProfilePicSet){
                        if(Utility.isNull(existFileName) == false){
                            Utility.removeFile(path.join(appRoot+constants.PHYSICAL_IMAGE_PATH.USER_PROFILE_PIC_ORIGINAL,existFileName));
                            Utility.removeFile(path.join(appRoot+constants.PHYSICAL_IMAGE_PATH.USER_PROFILE_PIC_THUMB,existFileName));
                        }
                    }

                    vccResponse = new VccResponse(response);

                    if(Utility.isNull(customer.profile_pic) == false && customer.profile_pic.length>0){
                        vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                            .setResponseBody({
                                profile_pic:path.join(constants.IMAGE_PATH.USER_PROFILE_PIC_ORIGINAL,"/",customer.profile_pic),
                                profile_pic_thumb:path.join(constants.IMAGE_PATH.USER_PROFILE_PIC_THUMB,"/",customer.profile_pic)
                            })
                            .send();
                    }else{
                        vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                            .send();
                    }
                }).catch(function (error) {
                    dbErrorCallBack(error)
                });
            }).catch(function (error) {
            dbErrorCallBack(error)
        });
    },

    getGamification:function (request, response) {
        async.series({
            wineArchivePoints:function (callback) {
                async.parallel({
                    sumPoints:function (callback) {
                        models.GamificationUserPointHistory.sum("point",{
                            where:{
                                customer_id:request.token.customer_id,
                                event_type:constants.GAMIFICATION_EVENT_TYPE.WINE_ARCHIVE
                            }
                        }).then(function (sum) {
                           callback(null,sum);
                        }).catch(function (error) {
                            Logger.logDbError(error,request);
                            callback(null,0);
                        });
                    },
                    countQty:function (callback) {
                        models.UserArchive.count({
                            where:{
                                customer_id:request.token.customer_id,
                                archive_type:{
                                    $or:[constants.USER_ARCHIVE_TYPE.VIN_IN,constants.USER_ARCHIVE_TYPE.VIN_OUT]
                                }
                            }
                        }).then(function (count) {
                            callback(null,count);
                        }).catch(function (error) {
                            Logger.logDbError(error,request);
                            callback(null,0);
                        });
                    }

                },function (error, results) {
                    var data = {
                        title:"Wines in Archive",
                        points:results.sumPoints,
                        qty:results.countQty,
                        order:1
                    };

                    callback(null,data);
                });
            },
            wineRatedPoints:function (callback) {
                async.parallel({
                    sumPoints:function (callback) {
                        models.GamificationUserPointHistory.sum("point",{
                            where:{
                                customer_id:request.token.customer_id,
                                event_type:constants.GAMIFICATION_EVENT_TYPE.WINE_RATED
                            }
                        }).then(function (sum) {
                            callback(null,sum);
                        }).catch(function (error) {
                            Logger.logDbError(error,request);
                            callback(null,0);
                        });
                    },
                    countQty:function (callback) {
                        models.RatingMenu.count({
                            where:{
                                customer_id:request.token.customer_id
                            }
                        }).then(function (count) {
                            callback(null,count);
                        }).catch(function (error) {
                            Logger.logDbError(error,request);
                            callback(null,0);
                        });
                    }

                },function (error, results) {
                    var data = {
                        title:"Rated Wines",
                        points:results.sumPoints,
                        qty:results.countQty,
                        order:2
                    };

                    callback(null,data);
                });
            },
            favWinesPoints:function (callback) {
                async.parallel({
                    sumPoints:function (callback) {
                        models.GamificationUserPointHistory.sum("point",{
                            where:{
                                customer_id:request.token.customer_id,
                                event_type:constants.GAMIFICATION_EVENT_TYPE.FAVORITE_WINE
                            }
                        }).then(function (sum) {
                            callback(null,sum);
                        }).catch(function (error) {
                            Logger.logDbError(error,request);
                            callback(null,0);
                        });
                    },
                    countQty:function (callback) {
                        models.UserArchive.count({
                            where:{
                                customer_id:request.token.customer_id,
                                archive_type:constants.USER_ARCHIVE_TYPE.MY_FAVORITE
                            }
                        }).then(function (count) {
                            callback(null,count);
                        }).catch(function (error) {
                            Logger.logDbError(error,request);
                            callback(null,0);
                        });
                    }

                },function (error, results) {
                    var data = {
                        title:"Favorite Wines",
                        points:results.sumPoints,
                        qty:results.countQty,
                        order:3
                    };

                    callback(null,data);
                });
            },
            archiveRestaurantPoints:function (callback) {
                async.parallel({
                    sumPoints:function (callback) {
                        models.GamificationUserPointHistory.sum("point",{
                            where:{
                                customer_id:request.token.customer_id,
                                event_type:constants.GAMIFICATION_EVENT_TYPE.RESTAURANT_ARCHIVE
                            }
                        }).then(function (sum) {
                            callback(null,sum);
                        }).catch(function (error) {
                            Logger.logDbError(error,request);
                            callback(null,0);
                        });
                    },
                    countQty:function (callback) {
                        models.UserPlaces.count({
                            where:{
                                customer_id:request.token.customer_id,
                                user_place_type:constants.USER_ARCHIVE_TYPE.MY_PLACE
                            }
                        }).then(function (count) {
                            callback(null,count);
                        }).catch(function (error) {
                            Logger.logDbError(error,request);
                            callback(null,0);
                        });
                    }

                },function (error, results) {
                    var data = {
                        title:"Restaurants in Archive",
                        points:results.sumPoints,
                        qty:results.countQty,
                        order:4
                    };

                    callback(null,data);
                });
            },
            favRestaurantPoints:function (callback) {
                async.parallel({
                    sumPoints:function (callback) {
                        models.GamificationUserPointHistory.sum("point",{
                            where:{
                                customer_id:request.token.customer_id,
                                event_type:constants.GAMIFICATION_EVENT_TYPE.FAVORITE_RESTAURANT
                            }
                        }).then(function (sum) {
                            callback(null,sum);
                        }).catch(function (error) {
                            Logger.logDbError(error,request);
                            callback(null,0);
                        });
                    },
                    countQty:function (callback) {
                        models.UserPlaces.count({
                            where:{
                                customer_id:request.token.customer_id,
                                user_place_type:constants.USER_ARCHIVE_TYPE.MY_FAVORITE
                            }
                        }).then(function (count) {
                            callback(null,count);
                        }).catch(function (error) {
                            Logger.logDbError(error,request);
                            callback(null,0);
                        });
                    }

                },function (error, results) {
                    var data = {
                        title:"Favorite Restaurants",
                        points:results.sumPoints,
                        qty:results.countQty,
                        order:5
                    };

                    callback(null,data);
                });
            },
            surveyQuestionPoints:function (callback) {
                async.parallel({
                    sumPoints:function (callback) {
                        models.GamificationUserPointHistory.sum("point",{
                            where:{
                                customer_id:request.token.customer_id,
                                event_type:constants.GAMIFICATION_EVENT_TYPE.QUESTIONS
                            }
                        }).then(function (sum) {
                            callback(null,sum);
                        }).catch(function (error) {
                            Logger.logDbError(error,request);
                            callback(null,0);
                        });
                    },
                    countQty:function (callback) {
                        models.GamificationUserPointHistory.count({
                            where:{
                                customer_id:request.token.customer_id,
                                event_type:constants.GAMIFICATION_EVENT_TYPE.QUESTIONS
                            }
                        }).then(function (count) {
                            callback(null,count);
                        }).catch(function (error) {
                            Logger.logDbError(error,request);
                            callback(null,0);
                        });
                    }

                },function (error, results) {
                    var data = {
                        title:"Profile Question Answered",
                        points:results.sumPoints,
                        qty:results.countQty,
                        order:6
                    };

                    callback(null,data);
                });
            },
            friendsPoints:function (callback) {
                async.parallel({
                    sumPoints:function (callback) {
                        models.GamificationUserPointHistory.sum("point",{
                            where:{
                                customer_id:request.token.customer_id,
                                event_type:constants.GAMIFICATION_EVENT_TYPE.FRIEND_INVITED
                            }
                        }).then(function (sum) {
                            callback(null,sum);
                        }).catch(function (error) {
                            Logger.logDbError(error,request);
                            callback(null,0);
                        });
                    },
                    countQty:function (callback) {
                        models.GamificationUserPointHistory.count({
                            where:{
                                customer_id:request.token.customer_id,
                                event_type:constants.GAMIFICATION_EVENT_TYPE.FRIEND_INVITED
                            }
                        }).then(function (count) {
                            callback(null,count);
                        }).catch(function (error) {
                            Logger.logDbError(error,request);
                            callback(null,0);
                        });
                    }

                },function (error, results) {
                    var data = {
                        title:"Accepted friends invitations",
                        points:results.sumPoints,
                        qty:results.countQty,
                        order:7
                    };

                    callback(null,data);
                });
            },
            totalPoints:function (callback) {
                models.GamificationUserPoints.sum("total_points",{
                    where:{
                        customer_id:request.token.customer_id
                    }
                }).then(function (sum) {
                    callback(null,sum);
                }).catch(function (error) {
                    Logger.logDbError(error,request);
                    callback(null,0);
                });
            }
        },function (error, results) {
            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({
                    total_points:results.totalPoints,
                    wine:[
                        results.wineArchivePoints,
                        results.wineRatedPoints,
                        results.favWinesPoints
                    ],
                    restaurant:[
                        results.archiveRestaurantPoints,
                        results.favRestaurantPoints
                    ],
                    profile:[
                        results.surveyQuestionPoints,
                        results.friendsPoints
                    ]
                })
                .send();
        });
    }
};