/**
 * Created by ravimodha on 15/08/16.
 */
const path = require("path");
const crypto = require("crypto");
const moment = require('moment');
const jwt = require('jsonwebtoken');
const async = require("async");
const nodemailer = require('nodemailer');
const generator = require('generate-password');
const curlRequest = require('request');

const EmailTemplate = require('email-templates').EmailTemplate;

const models = require("../models");
const constants = require(appRoot+'/common/constants');
const config    = require(appRoot+"/app_config.js");
const vincompassController = require('../controllers/vincompass_controller');

const VccResponse = require(appRoot+'/common/vcc_response');
const Memcache = require(appRoot+'/common/memcache');
const Logger = require(appRoot+'/common/logger');
const Utility = require(appRoot+'/common/utility');
const CsvAnalytics = require(appRoot+'/common/csv_analytics');

function checkForExistingEmail(email,callback) {
    models.Customers.count({
        where:{
            email:email
        }
    }).then(function (count) {
        callback(null,count);
    }).catch(function (error) {
        callback(error,null);
    })
}

function registerUser(request, callback) {
    var userDetails = {};
    
    var sendRegistrationEmail = function (userDetails, password) {
        var templateDir = "";

        if(userDetails.user_type == constants.USER_TYPE.LINKED_IN || userDetails.user_type == constants.USER_TYPE.AFFLUENCE){
            templateDir = path.join(appRoot, 'email_templates', 'social_registration');
        }else{
            templateDir = path.join(appRoot, 'email_templates', 'registration');
        }

        var registrationTemplate = new EmailTemplate(templateDir);
        var registrationDetail = {first_name: userDetails.first_name, email: userDetails.email, password:password};

        registrationTemplate.render(registrationDetail, function (err, results) {
            if(err){
                console.log(err);
                callback(null,userDetails);
            }else{
                //var transporter = nodemailer.createTransport(config.ENV_CONFIG.mailConfig.smtps);

                var transporter = nodemailer.createTransport({
                    host: config.ENV_CONFIG.mailConfig.host,
                    port: config.ENV_CONFIG.mailConfig.port,
                    secure: config.ENV_CONFIG.mailConfig.secure, // use SSL
                    auth: {
                        user: config.ENV_CONFIG.mailConfig.username,
                        pass: config.ENV_CONFIG.mailConfig.password
                    }
                });

                var mailOptions = {
                    from: config.ENV_CONFIG.mailConfig.from,
                    to: userDetails.email,
                    subject: 'Welcome to VinCompass',
                    html: results.html
                };

                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error);
                    }else{
                        console.log("Mail Sent!");
                    }

                    callback(null,userDetails,userPassword);
                });
            }
        });
    };

    var userPassword = generator.generate({
        length: 6,
        numbers: true
    });

    userDetails.first_name = request.body.first_name;
    userDetails.last_name = request.body.last_name;
    userDetails.email = request.body.email;
    userDetails.username = request.body.email;
    userDetails.birthday = request.body.birthdate;
    userDetails.mobile_phone = request.body.mobile_phone;
    userDetails.password = crypto.createHash('md5').update(userPassword).digest("hex");
    userDetails.price_from = 0;
    userDetails.price_to = 50;
    userDetails.survey_group = constants.SURVEY_QUESTION_GROUP;
    userDetails.status = "Normal";
    userDetails.added = moment.utc();
    userDetails.hash_key = crypto.createHash('md5').update((request.body.email + moment().utc().unix())).digest("hex");
    userDetails.is_registered = 1;
    userDetails.latitude = 0;
    userDetails.longitude = 0;
    userDetails.photo="";
    userDetails.gender = 0;
    userDetails.price_direction = constants.PRICE_DIRECTION.BEST;
    userDetails.confirmed = 1;

    if(Utility.isNull(request.body.linked_in_id) == false){
        userDetails.li_id = request.body.linked_in_id;
    }

    if(Utility.isNull(request.body.user_type) == false){
        userDetails.user_type = request.body.user_type;
    }

    if(Utility.isNull(request.body.invitation_code) == false){
        userDetails.url = request.body.invitation_code;
    }

    if(Utility.isNull(request.body.address_details) == false){
        var addressDetails = request.body.address_details;

        userDetails.address = addressDetails.address;
        userDetails.address_2 = addressDetails.address_2;
        userDetails.city = addressDetails.city;
        userDetails.state= addressDetails.state;
        userDetails.country = addressDetails.country;
        userDetails.zip = addressDetails.zip;
    }

    models.Customers
        .create(userDetails)
        .then(function (user) {
            sendRegistrationEmail(user,userPassword);
        }).catch(function (error) {
            callback(error,null);
    });
}

function validateInviteCode(inviteCode, email, callback) {
    var error = null;

    var whereCondition = {
        code:inviteCode,
        active:1
    };

    models.IcServiceInvitationCode.findOne({
        where:whereCondition
    }).then(function (inviteCodeDetails) {

        if(inviteCodeDetails){
            var startDate = moment(inviteCodeDetails.start).format("YYYY-MM-DD");
            var endDate = moment(inviteCodeDetails.end).format("YYYY-MM-DD");
            var currentDate = moment().format("YYYY-MM-DD");

            if((moment(startDate).isBefore(currentDate) == false && moment(startDate).isSame(currentDate) == false) ||
                (moment(endDate).isAfter(currentDate) == false && moment(endDate).isSame(currentDate) == false) ||
                (inviteCodeDetails.registrations >= inviteCodeDetails.quantity)){

                error = {
                    code:VccResponse.INVALID_VALUE,
                    error:constants.ERROR_MESSAGES.INVALID_INVITATION_CODE
                }
            }else if(inviteCodeDetails.code_type == constants.INVITE_CODE_TYPE.FRIEND_INVITE){
                if(Utility.isNull(email) == false && inviteCodeDetails.email != email){
                    error = {
                        code:VccResponse.INVALID_VALUE,
                        error:constants.ERROR_MESSAGES.INVALID_INVITATION_CODE
                    }
                }
            }

            callback(null,error,inviteCodeDetails);
        }else{
            error = {
                code:VccResponse.RECORD_NOT_EXIST,
                error:constants.ERROR_MESSAGES.INVALID_INVITATION_CODE
            };

            callback(null,error,null);
        }
    }).catch(function (error) {
        callback(error,null,null);
    });
}

function insertSurveyAnswers(customerAnswers, customer_id, callback) {
    for (var i=0;i<customerAnswers.length;i++){
        var customerAnswer = customerAnswers[i];
        customerAnswer.customer_id = customer_id;
    }

    models.CustomerAnswers.bulkCreate(customerAnswers,{individualHooks: true}).then(function (customerAnswers) {
        callback(null);
    }).catch(function (error) {
        callback(error);
    });
}

function processInvitationCode(inviteCodeDetails, registeredUser, callback) {
    var addDate = moment.utc();

    async.parallel(
        {
            addFriend: function (callback) {
                if(inviteCodeDetails.code_type == constants.INVITE_CODE_TYPE.FRIEND_INVITE){
                    async.waterfall([
                        function (waterfallCallback) {

                            models.Customers.findById(inviteCodeDetails.add_user_id)
                                .then(function (user) {
                                    var friendArray = [
                                        {
                                            customer_id:inviteCodeDetails.add_user_id,
                                            friend_id:registeredUser.id,
                                            friend_email:registeredUser.email,
                                            friend_first_name:registeredUser.first_name,
                                            friend_last_name:registeredUser.last_name,
                                            date_added:addDate,
                                            medium:inviteCodeDetails.invite_medium,
                                            influence:1,
                                            friends_influence:1,
                                            hash:crypto.createHash('md5').update((registeredUser.email + moment().utc().unix())).digest("hex")
                                        },
                                        {
                                            customer_id:registeredUser.id,
                                            friend_id:user.id,
                                            friend_email:user.email,
                                            friend_first_name:user.first_name,
                                            friend_last_name:user.last_name,
                                            date_added:addDate,
                                            medium:inviteCodeDetails.invite_medium,
                                            influence:1,
                                            friends_influence:1,
                                            hash:crypto.createHash('md5').update((user.email + moment().utc().unix())).digest("hex")
                                        }
                                    ];

                                    models.CustomerInvites.bulkCreate(friendArray,{individualHooks: true})
                                        .then(function (results) {
                                            waterfallCallback(null,results[0],user);
                                        }).catch(function (error) {
                                            waterfallCallback(error);
                                    });
                                }).catch(function (error) {
                                    waterfallCallback(error);
                            });



                            // models.CustomerInvites
                            //     .create(friendDetails)
                            //     .then(function (friend) {
                            //         waterfallCallback(null,friend);
                            //     }).catch(function (error) {
                            //     // Logger.logDbError(error,request);
                            //     waterfallCallback(error);
                            // })
                        },
                        // function (friend, waterfallCallback) {
                        //     models.Customers.findById(friend.customer_id)
                        //         .then(function (customer) {
                        //             waterfallCallback(null,friend,customer);
                        //         }).catch(function (error) {
                        //             waterfallCallback(error);
                        //     });
                        // },
                        function (friend, customer, waterfallCallback) {
                            console.log("Friend : "+friend);
                            var templateDir = path.join(appRoot, 'email_templates','friend');

                            var inviteTemplate = new EmailTemplate(templateDir);
                            var invitedDetail = {
                                from_user_first_name:customer.first_name,
                                to_user_full_name: (friend.friend_first_name + " " +friend.friend_last_name),
                                to_user_first_name: friend.friend_first_name
                            };

                            inviteTemplate.render(invitedDetail, function (err, results) {
                                if (err) {
                                    console.log(err);
                                    waterfallCallback(null);
                                } else {
                                    var transporter = nodemailer.createTransport({
                                        host: config.ENV_CONFIG.mailConfig.host,
                                        port: config.ENV_CONFIG.mailConfig.port,
                                        secure: config.ENV_CONFIG.mailConfig.secure, // use SSL
                                        auth: {
                                            user: config.ENV_CONFIG.mailConfig.username,
                                            pass: config.ENV_CONFIG.mailConfig.password
                                        }
                                    });

                                    var mailOptions = {
                                        from: config.ENV_CONFIG.mailConfig.from,
                                        to: customer.email,
                                        subject: 'Your Friend Has Joined Vincompass',
                                        html: results.html
                                    };

                                    console.log(mailOptions);

                                    transporter.sendMail(mailOptions, function(error, info){
                                        if(error){
                                            console.log(error);
                                        }
                                        console.log('Message sent: ' + info.response);

                                        waterfallCallback(null);
                                    });
                                }
                            });
                        }
                    ],function (error, result) {
                        callback(null);
                    });
                }else{
                    callback(null);
                }
            },
            updateInviteCodes:function (callback) {
                inviteCodeDetails.update(
                    {
                        updated_at:addDate,
                        registrations:(inviteCodeDetails.registrations + 1),
                        active:(inviteCodeDetails.code_type == constants.INVITE_CODE_TYPE.FRIEND_INVITE?0:1)
                    },{
                        fields:[
                            "updated_at",
                            "registrations",
                            "active"
                        ]
                    }
                ).then(function () {
                    callback();
                }).catch(function (error) {
                    // Logger.logDbError(error,request);
                    callback(error);
                })
            }
        },
        function (error, results) {
            if(error){
                console.log(error);
            }

            callback();
        }
    );
}

module.exports = {
    login: function (request, response, loginType) {
        var customResponse = new VccResponse(response);

        models.Customers.findOne(
            {
                where: {
                    email: (request.body.email || request.body.username)
                },
                attributes: [
                    "id",
                    "username",
                    "password",
                    "first_name",
                    "last_name",
                    "email",
                    "address",
                    "latitude",
                    "longitude",
                    "city",
                    "state",
                    "zip",
                    "hash_key",
                    "user_type",
                    ["CONCAT('"+path.join(constants.IMAGE_PATH.USER_PROFILE_PIC_THUMB,"/")+"',profile_pic)","profile_pic_thumb"],
                    ["CONCAT('"+path.join(constants.IMAGE_PATH.USER_PROFILE_PIC_ORIGINAL,"/")+"',profile_pic)","profile_pic"],
                    "is_admin"
                ]
            }
        ).then(function (user) {

            if (user){
                if(user.user_type == loginType){
                    var comparePassword = "";
                    var userPassword = "";

                    if(loginType == constants.USER_TYPE.NORMAL){
                        comparePassword = crypto.createHash('md5').update(request.body.password).digest("hex");
                        userPassword = user.password;
                    }

                    if(comparePassword == userPassword){
                        var tokenExpired = moment().utc().add(3,'M').unix();
                        // var tokenExpired = moment().utc().unix();
                        var token = jwt.sign({email: user.email, customer_id: user.id, token_expire: tokenExpired},constants.TOKEN_ENCRYPTION_KEY);

                        Memcache.sharedInstance()
                            .getMemcachePlus()
                            .get(user.email)
                            .then(function (userTokenArray) {
                                var callback = function () {
                                    var customerData = user.get({plain: true});
                                    customerData.token = token;
                                    customerData.token_expire = tokenExpired;

                                    models.CustomerBadgeCount.findOne({
                                        where:{
                                            customer_id:user.id
                                        }
                                    }).then(function (customerBadge) {
                                        var badgeCount = 0;

                                        if(customerBadge){
                                            badgeCount = customerBadge.badge_count;
                                        }

                                        customerData.badge_count = badgeCount;
                                        customResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                                            .setResponseBody({User:customerData})
                                            .send();
                                    }).catch(function (error) {
                                        customResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                                            .setResponseBody({User:customerData})
                                            .send();
                                    });
                                };

                                if(Utility.isNull(userTokenArray) == false){
                                    userTokenArray.push(token);

                                    Memcache.sharedInstance()
                                        .getMemcachePlus()
                                        .replace(user.email,userTokenArray)
                                        .then(function () {
                                            callback();
                                        }).catch(function (error) {
                                        //Logger.logDbError(error,request);

                                        customResponse = new VccResponse(response);
                                        customResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                                            .send();
                                    });
                                }else{
                                    var tokenArray = [];
                                    tokenArray.push(token);

                                    Memcache.sharedInstance()
                                        .getMemcachePlus()
                                        .set(user.email,tokenArray)
                                        .then(function () {
                                            callback();
                                        }).catch(function (error) {
                                        console.log(error);
                                    })
                                }
                            }).catch(function (error) {
                            //Add code to log error
                            customResponse = new VccResponse(response);
                            customResponse.setStatusCode(VccResponse.UNKNOWN_ERROR)
                                .send();
                        });
                    }else{
                        customResponse.setStatusCode(VccResponse.INVALID_PASSWORD)
                            .setResponseBody({error: constants.ERROR_MESSAGES.INVALID_PASSWORD})
                            .send();
                    }
                }else{
                    if(loginType == constants.USER_TYPE.NORMAL){
                        customResponse.setStatusCode(VccResponse.INVALID_USER_TYPE)
                            .setResponseBody({error: constants.ERROR_MESSAGES.INVALID_USERNAME})
                            .send();
                    }else if(loginType == constants.USER_TYPE.LINKED_IN || loginType == constants.USER_TYPE.AFFLUENCE){
                        customResponse.setStatusCode(VccResponse.INVALID_USER_TYPE)
                            .setResponseBody({error: constants.ERROR_MESSAGES.INVALID_USERNAME})
                            .send();
                    }else{
                        customResponse.setStatusCode(VccResponse.INVALID_USER_TYPE)
                            .setResponseBody({error: constants.ERROR_MESSAGES.INVALID_USERNAME})
                            .send();
                    }
                }
            }else{

                customResponse = new VccResponse(response);
                customResponse.setStatusCode(VccResponse.INVALID_USERNAME)
                    .setResponseBody({error: constants.ERROR_MESSAGES.INVALID_USERNAME})
                    .send();
            }
        }).catch(function (error) {
            Logger.logDbError(error,request);

            customResponse = new VccResponse(response);
            customResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        })
    },

    getSurveyQuestions:function (request, response) {
        models.Questions.findAll({
            attributes:[
                ["id","question_id"],
                "question",
                ["type","question_type"]
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
                        survey_group:99
                    }
                }
            ],
            where:{
                survey_group:99
            },
            order: [
                ['number', 'ASC'],
                [{model: models.Answers, as: 'answers'}, 'id', 'ASC']
            ]
        }).then(function (surveyQuestions) {
            var vccResponse = new VccResponse(response);

            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({survey_questions: surveyQuestions})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    },

    register:function (request, response, invitationCodeDetails) {
        checkForExistingEmail(request.body.email,function (error, count) {
            var vccResponse = null;

            if(error){
                Logger.logDbError(error,request);

                vccResponse = new VccResponse(response);
                vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                    .send();
            }else{
                if(count>0){
                    vccResponse = new VccResponse(response);
                    vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                        .setResponseBody({error: constants.ERROR_MESSAGES.EMAIL_EXIST})
                        .send();
                }else{
                    vincompassController.validateSurveyAnswers(request.body.questions,function (error, customerAnswerDetails) {
                        if(error){
                            vccResponse = new VccResponse(response);
                            vccResponse.setStatusCode(error.error_code)
                                .setResponseBody({error: error.message})
                                .send();
                        }else{
                            registerUser(request,function (error, userDetails, userPassword) {
                                if(error){
                                    Logger.logDbError(error,request);

                                    vccResponse = new VccResponse(response);
                                    vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                                        .send();
                                }else{
                                    var customerAnswers = customerAnswerDetails.customer_answers;
                                    vccResponse = new VccResponse(response);

                                    console.log(userDetails);

                                    async.series(
                                        {
                                            insertSurveyAnswers:function (callback) {
                                                if(customerAnswers.length > 0){
                                                    insertSurveyAnswers(customerAnswers,userDetails.id,function (error) {
                                                        if(error){
                                                            Logger.logDbError(error,request);
                                                        }

                                                        callback(null,null);
                                                    });
                                                }else{
                                                    callback(null,null);
                                                }
                                            },
                                            addQuestionGamificationPoints:function (callback) {
                                                if(customerAnswers.length > 0){
                                                    vincompassController.addGamificationPoint(constants.GAMIFICATION_EVENT_TYPE.QUESTIONS,customerAnswerDetails.question_ids_with_answers,userDetails.id,request,function () {
                                                        callback(null,null);
                                                    });
                                                }else{
                                                    callback(null,null);
                                                }
                                            },
                                            processInvitationCode:function (callback) {
                                                if(Utility.isNull(request.body.invitation_code) == false){
                                                    processInvitationCode(invitationCodeDetails, userDetails, function () {
                                                        callback(null,null);
                                                    });
                                                }else{
                                                    callback(null,null);
                                                }
                                            },
                                            addFriendGamificationPoints:function (callback) {
                                                if(Utility.isNull(request.body.invitation_code) == false){
                                                    if(invitationCodeDetails.code_type == constants.INVITE_CODE_TYPE.FRIEND_INVITE){
                                                        vincompassController.addGamificationPoint(constants.GAMIFICATION_EVENT_TYPE.FRIEND_INVITED,[userDetails.id],invitationCodeDetails.add_user_id,request,function () {
                                                            callback(null,null);
                                                        });
                                                    }else{
                                                        callback(null,null);
                                                    }
                                                }else{
                                                    callback(null,null);
                                                }
                                            }
                                        },
                                        function (error, results) {
                                            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                                                .setResponseBody({password:userPassword})
                                                .send();
                                        }
                                    );
                                }
                            });
                        }
                    });
                }
            }
        });
    },

    validateInviteCode:function (request, response) {
        var vccResponse = null;

        validateInviteCode(request.body.invitation_code, null, function (dbError, error, inviteCodeDetails) {
            vccResponse = new VccResponse(response);

            if(dbError){
                Logger.logDbError(dbError,request);

                vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                    .send();
            }else if(error){
                vccResponse.setStatusCode(error.code)
                    .setResponseBody(error)
                    .send();
            }else{
                vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                    .setResponseBody({
                        email:inviteCodeDetails.email,
                        first_name: inviteCodeDetails.first_name,
                        last_name:inviteCodeDetails.last_name,
                        mobile:inviteCodeDetails.mobile
                    }).send();
            }
        });
    },

    registerViaInviteCode:function (request, response) {
        var self = this;
        var vccResponse = null;

        validateInviteCode(request.body.invitation_code, request.body.email, function (dbError, error, inviteCodeDetails) {
            vccResponse = new VccResponse(response);

            if(dbError){
                Logger.logDbError(dbError,request);

                vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                    .send();
            }else if(error){
                vccResponse.setStatusCode(error.code)
                    .setResponseBody(error)
                    .send();
            }else{
                self.register(request,response,inviteCodeDetails);
            }
        });
    },

    forgotPassword:function (request, response) {
        var vccResponse = new VccResponse(response);

        models.Customers.findOne({
            where: {
                email: request.params.email
            }
        }).then(function (customer) {
            var userPassword = generator.generate({
                length: 6,
                numbers: true
            });

            if(customer){
                if(customer.user_type == constants.USER_TYPE.NORMAL){
                    customer.update(
                        {
                            password:crypto.createHash('md5').update(userPassword).digest("hex")
                        },
                        {
                            fields:[
                                "password"
                            ]
                        }
                    ).then(function () {
                        var templateDir = path.join(appRoot, 'email_templates', 'reset_password');

                        var resetPasswordTemplate = new EmailTemplate(templateDir);
                        var registrationDetail = {password:userPassword,first_name:customer.first_name};

                        resetPasswordTemplate.render(registrationDetail, function (err, results) {
                            if(err){
                                console.log(err);

                                vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                                    .send();
                            }else{
                                //var transporter = nodemailer.createTransport(config.ENV_CONFIG.mailConfig.smtps);

                                var transporter = nodemailer.createTransport({
                                    host: config.ENV_CONFIG.mailConfig.host,
                                    port: config.ENV_CONFIG.mailConfig.port,
                                    secure: config.ENV_CONFIG.mailConfig.secure, // use SSL
                                    auth: {
                                        user: config.ENV_CONFIG.mailConfig.username,
                                        pass: config.ENV_CONFIG.mailConfig.password
                                    }
                                });

                                var mailOptions = {
                                    from: config.ENV_CONFIG.mailConfig.from,
                                    to: request.params.email,
                                    subject: 'Confirming Your VinCompass Password Reset',
                                    html: results.html
                                };

                                transporter.sendMail(mailOptions, function(error, info){
                                    if(error){
                                        console.log(error);
                                    }else{
                                        console.log("Mail Sent!");
                                    }

                                    vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                                        .send();
                                });
                            }
                        });
                    }).catch(function (error) {
                        Logger.logDbError(error,response);

                        vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                            .send();
                    })
                }else{
                    var errorMessage = constants.ERROR_MESSAGES.INVALID_USER_TYPE;

                    if(customer.user_type == constants.USER_TYPE.LINKED_IN){
                        errorMessage = errorMessage.replace("SOCIAL_TYPE","LinkedIn");
                    }else if(customer.user_type == constants.USER_TYPE.AFFLUENCE){
                        errorMessage = errorMessage.replace("SOCIAL_TYPE","Affluence");
                    }

                    vccResponse.setStatusCode(VccResponse.INVALID_USER_TYPE)
                        .setResponseBody({error:errorMessage})
                        .send();
                }
            }else{
                vccResponse.setStatusCode(VccResponse.RECORD_NOT_EXIST)
                    .setResponseBody({error:constants.ERROR_MESSAGES.USER_NOT_EXIST})
                    .send();
            }
        }).catch(function (error) {
            Logger.logDbError(error,response);

            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });

    },

    affluenceLogin:function (request, response) {
        var vccResponse = new VccResponse(response);

        async.waterfall([
            function (callback) {
                curlRequest(
                    {
                        method:"POST",
                        uri:constants.AFFLUENCE.AUTHORIZE_APP_URL,
                        body:JSON.stringify({key:constants.AFFLUENCE.KEY,secret:constants.AFFLUENCE.SECRET})
                    },
                    function (error, res, body) {
                        if(!error){
                            var responseBody = JSON.parse(body);

                            if(Utility.isNull(responseBody) == false && Utility.isNull(responseBody.code) == false){
                                callback({code:VccResponse.AFFLUENCE_ERROR,error:responseBody.message});
                            }else{
                                callback(null,responseBody.access_token);
                            }
                        }else{
                            callback({code:VccResponse.UNKNOWN_ERROR,message:"Unable to connect server."});
                        }
                    }
                );
            },
            function (accessToken, callback) {
                console.log(JSON.stringify({access_token:accessToken,email:request.body.email,password:request.body.password}));
                curlRequest(
                    {
                        method:"POST",
                        uri:constants.AFFLUENCE.AUTHORIZE_USER_URL,
                        body:JSON.stringify({access_token:accessToken,email:request.body.email,password:request.body.password})
                    },
                    function (error, res, body) {
                        if(!error){
                            var responseBody = JSON.parse(body);

                            if(Utility.isNull(responseBody) == false && Utility.isNull(responseBody.code) == false){
                                callback({code:VccResponse.AFFLUENCE_ERROR,error:responseBody.error});
                            }else{
                                callback(null,responseBody.user_token);
                            }
                        }else{
                            callback({code:VccResponse.UNKNOWN_ERROR,message:"Unable to connect server."});
                        }
                    }
                );
            }
        ],function (error, results) {
            if(error){
                vccResponse.setStatusCode(error.code)
                    .setResponseBody({error:error.error})
                    .send();
            }else{
                vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                    .send();
            }
        });
    },
    createTokenForWordPress:function (request, response) {
        var vccResponse = new VccResponse(response);
        
        Memcache.sharedInstance()
            .getMemcachePlus()
            .get(request.body.session_id)
            .then(function (session) {
                if(session){
                    var tokenExpired = moment().utc().add(3,'M').unix();
                    var token = jwt.sign({session_id: request.body.session_id, token_type:"WORD_PRESS", token_expire: tokenExpired},constants.TOKEN_ENCRYPTION_KEY);

                    vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                        .setResponseBody({token:token,token_expired:tokenExpired})
                        .send();
                }else{
                    vccResponse.setStatusCode(VccResponse.INVALID_VALUE)
                        .setResponseBody({error:"Invalid session id"})
                        .send();
                }
            }).catch(function (error) {
                Memcache.sharedInstance().clear();
                vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                    .send();
            })
    },

    testEmailTemplate:function (request, response) {
        // var templateDir = path.join(appRoot, 'email_templates', 'registration');
        //
        // var registrationTemplate = new EmailTemplate(templateDir);
        // var registrationDetail = {first_name: 'Ravi', email: 'ravi@pxminfo.com', password:'p@ssw0rd'};
        // registrationTemplate.render(registrationDetail, function (err, results) {
        //     if(err){
        //         console.log(err);
        //     }else{
        //         console.log(results.html);
        //
        //         var transporter = nodemailer.createTransport({
        //             host: config.ENV_CONFIG.mailConfig.host,
        //             port: config.ENV_CONFIG.mailConfig.port,
        //             secure: config.ENV_CONFIG.mailConfig.secure, // use SSL
        //             auth: {
        //                 user: config.ENV_CONFIG.mailConfig.username,
        //                 pass: config.ENV_CONFIG.mailConfig.password
        //             }
        //         });
        //
        //         //var transporter = nodemailer.createTransport('smtps://ravi@pixometryinfosoft.com:M0dh@r@v19014$@mail2.krupix.com');
        //         var mailOptions = {
        //             from: "staff@vincompass.com",
        //             to: "ravi@pxminfo.com",
        //             subject: 'VinCompass Registration',
        //             html: results.html
        //         };
        //
        //         transporter.sendMail(mailOptions, function(error, info){
        //             if(error){
        //                 return console.log(error);
        //             }
        //             console.log('Message sent: ' + info.response);
        //
        //             var vccResponse = new VccResponse(response);
        //             vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
        //                 .send();
        //         });
        //     }
        // });

        // Memcache.sharedInstance()
        //     .getMemcachePlus()
        //     .get(request.token.email)
        //     .then(function (userTokenArray) {
        //         var vccResponse = new VccResponse(response);
        //         vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
        //             .setResponseBody(userTokenArray)
        //             .send();
        //     });

        // Memcache.sharedInstance()
        //     .getMemcachePlus()
        //     .items()
        //     .then(function (items) {
        //         var vccResponse = new VccResponse(response);
        //         vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
        //             .setResponseBody(items)
        //             .send();
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     })

        // Memcache.sharedInstance()
        //     .getMemcachePlus()
        //     .delete(request.token.email)
        //     .then(function () {
        //         var vccResponse = new VccResponse(response);
        //         vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
        //             .send();
        //     })


        //CsvAnalytics.sharedInstance().wineWizardAnalytics([1,2]);

        var vccResponse = new VccResponse(response);
        vccResponse.setStatusCode(VccResponse.SUCCESS_CODE).send();
    }
};