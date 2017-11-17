/**
 * Created by ravimodha on 05/01/17.
 */

const moment = require('moment');
const async = require("async");
const underscore = require('underscore');

const constants = require(appRoot+'/common/constants');

const models = require("../models");

const VccResponse = require(appRoot+'/common/vcc_response');
const Utility = require(appRoot+'/common/utility');
const Logger = require(appRoot+'/common/logger');

module.exports = {
    checkLastGameificationInsert:function (customerId, pointTypeId, restaurantId, menuId) {
        if(pointTypeId == constants.GAMIFICATION_POINT_TYPE.DISCOVER){

        }else if(pointTypeId == constants.GAMIFICATION_POINT_TYPE.RATE_WINE){

        }else if(pointTypeId == constants.GAMIFICATION_POINT_TYPE.SOCIALIZE){

        }else{
            return true;
        }
    },
    validateSurveyAnswers:function (questionArray,callback) {
        var customerAnswers = [];
        var error = null;
        var customerAnswerIndex = 0;
        var questionIds = [];
        var questionIdsWithAnswers = [];
        var count = 0;

        if(Utility.isNull(questionArray) == false){
            for (var i=0;i<questionArray.length;i++){
                var question = questionArray[i];
                var questionType = question.question_type;
                var questionId = question.question_id;
                var answerArray = question.answers;

                questionIds[i] = questionId;

                if(questionType == constants.SURVEY_QUESTION_TYPES.RADIO){
                    if(Utility.isNull(answerArray) == false){
                        if(answerArray.length<=0){
                            error = {
                                error_code:VccResponse.INVALID_VALUE,
                                message:"Single choice question must have one answer."
                            };
                        }else if(answerArray.length>1){
                            error = {
                                error_code:VccResponse.INVALID_VALUE,
                                message:"Single choice question can have only one answer."
                            };
                        }
                    }else{
                        error = {
                            error_code:VccResponse.INVALID_VALUE,
                            message:"Single choice question must have one answer."
                        };
                    }
                }

                if(error){
                    break;
                }else{
                    if(Utility.isNull(answerArray) == false){
                        for (var j=0;j<answerArray.length;j++){
                            var answer = answerArray[j];
                            customerAnswers[customerAnswerIndex++] = {
                                question_id:questionId,
                                answer:answer.answer,
                                survey_group:constants.SURVEY_QUESTION_GROUP,
                                answer_id:answer.answer_id
                            };
                        }

                        if(answerArray.length > 0){
                            questionIdsWithAnswers[count++] = questionId;
                        }
                    }
                }
            }
        }

        callback(error,{question_ids:questionIds,customer_answers:customerAnswers,question_ids_with_answers:questionIdsWithAnswers});
    },

    addGamificationPoint:function (eventType, idArray, customerId, request, callback) {
        if(idArray.length > 0){
            async.parallel(
                {
                    gamificationEventPoints: function (callback) {
                        models.GamificationEventsPoint.findOne({
                            where:{
                                event:eventType
                            }
                        }).then(function (gamificationEventDetail) {
                            if(!gamificationEventDetail){
                                callback(null,0);
                            }else{
                                callback(null,gamificationEventDetail.add_point);
                            }
                        }).catch(function (error) {
                            Logger.logDbError(error,request);
                            callback(error);
                        });
                    },
                    userPointsDetails:function (callback) {
                        models.GamificationUserPoints.findOne({
                            where:{
                                customer_id:customerId
                            }
                        }).then(function (gamificationUserPointDetail) {
                            callback(null,gamificationUserPointDetail);
                        }).catch(function (error) {
                            Logger.logDbError(error,request);
                            callback(error);
                        });
                    }
                },
                function (error, results) {
                    if(!error){
                        if(results.gamificationEventPoints > 0){
                            var addDate = moment.utc();
                            var addPoints = results.gamificationEventPoints * idArray.length;
                            var insertPointToHistory = function () {
                                var recordArray = [];
                                for(var i=0;i<idArray.length;i++){
                                    var pointDetail = {
                                        customer_id:customerId,
                                        point:results.gamificationEventPoints,
                                        event_type:eventType,
                                        add_date:addDate
                                    };

                                    if(eventType == constants.GAMIFICATION_EVENT_TYPE.QUESTIONS){
                                        pointDetail.question_id = idArray[i];
                                    }else if(eventType == constants.GAMIFICATION_EVENT_TYPE.RESTAURANT_ARCHIVE ||
                                        eventType == constants.GAMIFICATION_EVENT_TYPE.FAVORITE_RESTAURANT){
                                        pointDetail.restaurant_id = idArray[i];
                                    }else if(eventType == constants.GAMIFICATION_EVENT_TYPE.WINE_ARCHIVE ||
                                        eventType == constants.GAMIFICATION_EVENT_TYPE.WINE_RATED ||
                                        eventType == constants.GAMIFICATION_EVENT_TYPE.FAVORITE_WINE){
                                        pointDetail.wine_id = idArray[i];
                                    }else if(eventType == constants.GAMIFICATION_EVENT_TYPE.FRIEND_INVITED){
                                        pointDetail.friend_id = idArray[i];
                                    }

                                    recordArray[i] = pointDetail;
                                }

                                models.GamificationUserPointHistory.bulkCreate(
                                    recordArray
                                ).then(function () {
                                    callback();
                                }).catch(function (error) {
                                    Logger.logDbError(error,request);
                                    callback();
                                });
                            };

                            if(Utility.isNull(results.userPointsDetails) == false){
                                results.userPointsDetails.update(
                                    {
                                        total_points:(results.userPointsDetails.total_points + addPoints),
                                        edit_date:addDate
                                    },
                                    {
                                        fields:[
                                            "total_points",
                                            "edit_date"
                                        ]
                                    }
                                ).then(function () {
                                    insertPointToHistory();
                                }).catch(function (error) {
                                    Logger.logDbError(error,request);
                                    callback();
                                })
                            }else{
                                models.GamificationUserPoints.create({
                                    customer_id:customerId,
                                    total_points:addPoints,
                                    add_date:addDate,
                                    edit_date:addDate
                                }).then(function () {
                                    insertPointToHistory();
                                }).catch(function (error) {
                                    Logger.logDbError(error,request);
                                    callback();
                                })
                            }
                        }else{
                            callback();
                        }
                    }else{
                        callback();
                    }
                }
            );
        }else{
            callback();
        }
    },

    deleteGamificationPoint:function (eventType, idArray, request, callback) {
        async.parallel(
            {
                gamificationEventPoints: function (callback) {
                    models.GamificationEventsPoint.findOne({
                        where:{
                            event:eventType
                        }
                    }).then(function (gamificationEventDetail) {
                        if(!gamificationEventDetail){
                            callback(null,0);
                        }else{
                            callback(null,gamificationEventDetail.add_point);
                        }
                    }).catch(function (error) {
                        Logger.logDbError(error,request);
                        callback(error);
                    });
                },
                userPointsDetails:function (callback) {
                    models.GamificationUserPoints.findOne({
                        where:{
                            customer_id:request.token.customer_id
                        }
                    }).then(function (gamificationUserPointDetail) {
                        callback(null,gamificationUserPointDetail);
                    }).catch(function (error) {
                        Logger.logDbError(error,request);
                        callback(error);
                    });
                }
            },
            function (error, results) {
                if(!error){
                    if(results.gamificationEventPoints > 0){
                        var addDate = moment.utc();
                        var minusPoints = results.gamificationEventPoints * idArray.length;
                        var insertPointToHistory = function () {
                            var recordArray = [];
                            for(var i=0;i<idArray.length;i++){
                                var pointDetail = {
                                    customer_id:request.token.customer_id,
                                    point:(-1 * results.gamificationEventPoints),
                                    event_type:eventType,
                                    add_date:addDate
                                };

                                if(eventType == constants.GAMIFICATION_EVENT_TYPE.QUESTIONS){
                                    pointDetail.question_id = idArray[i];
                                }else if(eventType == constants.GAMIFICATION_EVENT_TYPE.RESTAURANT_ARCHIVE ||
                                    eventType == constants.GAMIFICATION_EVENT_TYPE.FAVORITE_RESTAURANT){
                                    pointDetail.restaurant_id = idArray[i];
                                }else if(eventType == constants.GAMIFICATION_EVENT_TYPE.WINE_ARCHIVE ||
                                    eventType == constants.GAMIFICATION_EVENT_TYPE.WINE_RATED ||
                                    eventType == constants.GAMIFICATION_EVENT_TYPE.FAVORITE_WINE){
                                    pointDetail.wine_id = idArray[i];
                                }else if(eventType == constants.GAMIFICATION_EVENT_TYPE.FRIEND_INVITED){
                                    pointDetail.friend_id = idArray[i];
                                }

                                recordArray[i] = pointDetail;
                            }

                            models.GamificationUserPointHistory.bulkCreate(
                                recordArray
                            ).then(function () {
                                callback();
                            }).catch(function (error) {
                                Logger.logDbError(error,request);
                                callback();
                            });
                        };

                        if(Utility.isNull(results.userPointsDetails) == false){
                            results.userPointsDetails.update(
                                {
                                    total_points:(results.userPointsDetails.total_points - minusPoints),
                                    edit_date:addDate
                                },
                                {
                                    fields:[
                                        "total_points",
                                        "edit_date"
                                    ]
                                }
                            ).then(function () {
                                insertPointToHistory();
                            }).catch(function (error) {
                                Logger.logDbError(error,request);
                                callback();
                            })
                        }else{
                            models.GamificationUserPoints.create({
                                customer_id:request.token.customer_id,
                                total_points:0 - minusPoints,
                                add_date:addDate,
                                edit_date:addDate
                            }).then(function () {
                                insertPointToHistory();
                            }).catch(function (error) {
                                Logger.logDbError(error,request);
                                callback();
                            })
                        }
                    }else{
                        callback();
                    }
                }else{
                    callback();
                }
            }
        );
    },

    vinPrintPointCalculation:function (totalPoints) {
        var currentBottlePercentage = 0;
        var totalBottles = 0;
        var totalCases = 0;
        var userVinPointDetails = {};

        if(totalPoints > 0){
            var remainingPoints = 0;
            var currentBottleReminder = 0;

            // totalBottles = parseInt(totalPoints/constants.GAMIFICATION.FULL_BOTTLE_POINTS);
            // totalCases = parseInt(totalBottles/constants.GAMIFICATION.FULL_CASE);
            // remainingPoints = totalPoints - (totalBottles * constants.GAMIFICATION.FULL_BOTTLE_POINTS);

            // if(remainingPoints<=constants.GAMIFICATION.NO_OF_EVENTS){
            //     currentBottleReminder = 0;
            // }else{
            //     currentBottleReminder = remainingPoints % constants.GAMIFICATION.NO_OF_EVENTS;
            // }

            // if(currentBottleReminder == 1){
            //     currentBottlePercentage = 20;
            // }else if(currentBottleReminder == 2){
            //     currentBottlePercentage = 40;
            // }else if(currentBottleReminder == 3){
            //     currentBottlePercentage = 60;
            // }else if(currentBottleReminder == 4){
            //     currentBottlePercentage = 80;
            // }

            totalBottles = parseInt(totalPoints/constants.GAMIFICATION.FULL_BOTTLE_POINTS);
            totalCases = parseInt(totalBottles/constants.GAMIFICATION.FULL_CASE);
            currentBottleReminder = totalPoints % constants.GAMIFICATION.FULL_BOTTLE_POINTS;

            if (totalCases > 0) {
                totalBottles = totalBottles - parseInt(totalCases * constants.GAMIFICATION.FULL_CASE); 
            }
            

            if(currentBottleReminder == 1){
                currentBottlePercentage = 20;
            }else if(currentBottleReminder == 2){
                currentBottlePercentage = 40;
            }else if(currentBottleReminder == 3){
                currentBottlePercentage = 60;
            }else if(currentBottleReminder == 4){
                currentBottlePercentage = 80;
            }

        }

        userVinPointDetails.total_points = totalPoints;
        userVinPointDetails.total_bottles = totalBottles;
        userVinPointDetails.total_cases = totalCases;
        userVinPointDetails.current_bottle_status = currentBottlePercentage;

        return userVinPointDetails;
    },
    getGrapeList:function () {
        var grapeArray = [
            "Sauvignon Blanc",
            "Cabernet Sauvignon",
            "Cabernet Franc",
            "Merlot",
            "Chardonnay",
            "Pinot Noir",
            "Shiraz/Syrah",
            "Riesling",
            "Zinfandel",
            "Pinot Grigio",
            "Grenache",
            "Malbec",
            "Chenin Blanc",
            "Sangiovese",
            "Viognier",
            "Tempranillo",
            "Gewurztraminer",
            "Gamay",
            "Nebbiolo",
            "Southern Red Rhone Blend",
            "Northern Red Rhone Blend",
            "Red Bordeaux Blend",
            "Gruner Vetliner"
        ];

        var grapeList = [];
        for (var i=0;i<grapeArray.length;i++){
            grapeList.push({"grape":grapeArray[i]});
        }

        return underscore.sortBy(grapeList,"grape");
    },
    getCountryList:function () {
        var countryArray = [
            "Argentina",
            "Australia",
            "Austria",
            "Canada",
            "Chile",
            "China",
            "France",
            "Georgia",
            "Germany",
            "Greece",
            "Hungary",
            "Italy",
            "New Zealand",
            "Portugal",
            "Russia",
            "South Africa",
            "Spain",
            "Switzerland",
            "UK",
            "USA",
            "Other"
        ];

        var countryList = [];
        for (var i=0;i<countryArray.length;i++){
            countryList.push({
                "display_order":i,
                "country":countryArray[i]
            });
        }

        return underscore.sortBy(countryList,"grape");
    }
};