/**
 * Created by ravimodha on 16/11/16.
 */

const moment = require('moment');
const validate = require("validate.js");
const path = require('path');
const curlRequest = require('request');
const async = require("async");
const underscore = require('underscore');

const VccResponse = require(appRoot+'/common/vcc_response');
const Logger = require(appRoot+'/common/logger');
const Utility = require(appRoot+'/common/utility');
const constants = require(global.appRoot+'/common/constants');
const vincompassController = require('../controllers/vincompass_controller');

const models = require("../models");
var config    = require(appRoot+"/app_config.js");

function calculateAvgRate(wine_id,callback) {
    models.sequelize.query("UPDATE wines " +
            "SET average_rate = (SELECT AVG(rate) FROM rating_menu WHERE wine_id=:wine_id) " +
        "WHERE id=:wine_id",{
        replacements:{
            wine_id:wine_id
        }
    }).then(function (results, metadata) {
        console.log("Results : "+results);
        console.log("Metadata : "+metadata);

        callback(null);
    }).catch(function (error) {
        callback(error);
    });
}

module.exports = {
    getVinOut:function (request, response) {
        var pageNo = 0;
        var noOfRecords = 0;
        var startIndex = 0;

        if(Utility.isNull(request.params.page_no) == false){
            pageNo = request.params.page_no;
        }

        if(Utility.isNull(request.params.no_of_records) == false){
            noOfRecords = request.params.no_of_records;
        }

        var columns = [
            "ua1.id AS archive_id",
            "ua1.menu_id",
            "ua1.add_date",
            "wines.id AS wine_id",
            "wines.vintage",
            "wines_description.name AS wine_name",
            "wines.description AS wine_description",
            "grapes.grape",
            "countries.country",
            "my_notes.note",
            "rating_menu.rate",
            "wines_description.type",
            "wines_description.color",
            "menu.price",
            "wines_description.region",
            "CONCAT('"+path.join(constants.IMAGE_PATH.MY_WINES_THUMB_PATH,"/")+"',REPLACE(my_wine_photos.photo, ' ', '%20' )) AS user_uploaded_photo_thumb",
            "CONCAT('"+path.join(constants.IMAGE_PATH.MY_WINES_ORIGINAL_PATH,"/")+"',REPLACE(my_wine_photos.photo, ' ', '%20' )) AS user_uploaded_photo",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_THUMB_PATH,"/")+"',REPLACE(wine_images.image, ' ', '%20' )) AS wine_photo_thumb",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_ORIGINAL_PATH,"/")+"',REPLACE(wine_images.image, ' ', '%20' )) AS wine_photo",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_ORIGINAL_PATH,"/")+"',GET_DEFAULT_WINE_IMAGE(wines_description.type,wines_description.color)) AS default_image",
            "(CASE WHEN EXISTS (SELECT * FROM user_archive AS ua2 WHERE customer_id = :customer_id AND archive_type = :favorite_value AND ua2.wine_id = ua1.wine_id) THEN true ELSE false END) AS is_favorite"
        ];

        if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.MOBILE){
            columns.push("wines.critic_rate");
            columns.push("wines.average_rate");
            columns.push("wines_description.producer");
            columns.push("wines_description.style");
            columns.push("wines.score");
        }

        var query = "SELECT " +
                columns.join(", ")+ " " +
            "FROM user_archive AS ua1 " +
            "INNER JOIN menu ON menu.id=ua1.menu_id AND menu.is_deleted = :is_deleted AND menu.active = :active " +
            "INNER JOIN wines ON wines.id = ua1.wine_id AND wines.is_deleted = :is_deleted " +
            "INNER JOIN wines_description ON wines_description.id = wines.wine_description_id AND wines_description.is_deleted = :is_deleted " +
            "LEFT OUTER JOIN grapes ON wines_description.grape_id = grapes.id " +
            "LEFT OUTER JOIN countries ON wines_description.country_id = countries.id " +
            "LEFT OUTER JOIN wine_types ON wines_description.type_id = wine_types.id " +
            "LEFT OUTER JOIN my_notes ON my_notes.wine_id = wines.id AND my_notes.customer_id = :customer_id " +
            "LEFT OUTER JOIN rating_menu ON rating_menu.wine_id = wines.id AND rating_menu.customer_id = :customer_id " +
            "LEFT OUTER JOIN my_wine_photos ON my_wine_photos.wine_id = wines.id AND my_wine_photos.customer_id = :customer_id " +
            "LEFT OUTER JOIN wine_images ON wine_images.wine_id = ua1.wine_id AND wine_images.featured_image=1 " +
            "WHERE ua1.customer_id = :customer_id AND archive_type = :user_archive_type " +
            "ORDER BY ua1.add_date DESC ";

        if(pageNo > 0 && noOfRecords > 0){
            startIndex = (pageNo - 1) * noOfRecords;
            query += "LIMIT :start_index, :offset";
        }

        models.sequelize.query(query,
            {
                replacements:{
                    customer_id:request.token.customer_id,
                    user_archive_type:constants.USER_ARCHIVE_TYPE.VIN_OUT,
                    favorite_value:constants.USER_ARCHIVE_TYPE.MY_FAVORITE,
                    active:1,
                    is_deleted:0,
                    start_index:startIndex,
                    offset:parseInt(noOfRecords) + 1
                },
                type: models.Sequelize.QueryTypes.SELECT
            }
        ).then(function (vinOutWines) {
            var nextPage = false;

            if(pageNo > 0 && noOfRecords > 0){
                if(vinOutWines.length == (parseInt(noOfRecords) + 1)){
                    nextPage = true;
                    vinOutWines.pop();
                }
            }

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({wines: vinOutWines,next_page:nextPage})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    },

    getVinIn:function (request, response) {
        var pageNo = 0;
        var noOfRecords = 0;
        var startIndex = 0;

        if(Utility.isNull(request.params.page_no) == false){
            pageNo = request.params.page_no;
        }

        if(Utility.isNull(request.params.no_of_records) == false){
            noOfRecords = request.params.no_of_records;
        }

        var columns = [
            "ua1.id AS archive_id",
            "ua1.menu_id",
            "ua1.add_date",
            "wines.id AS wine_id",
            "wines.vintage",
            "wines_description.name AS wine_name",
            "wines.description AS wine_description",
            "grapes.grape",
            "countries.country",
            "my_notes.note",
            "rating_menu.rate",
            "wines_description.type",
            "wines_description.color",
            "wines.price",
            "wines_description.region",
            "CONCAT('"+path.join(constants.IMAGE_PATH.MY_WINES_THUMB_PATH,"/")+"',REPLACE(my_wine_photos.photo, ' ', '%20' )) AS user_uploaded_photo_thumb",
            "CONCAT('"+path.join(constants.IMAGE_PATH.MY_WINES_ORIGINAL_PATH,"/")+"',REPLACE(my_wine_photos.photo, ' ', '%20' )) AS user_uploaded_photo",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_THUMB_PATH,"/")+"',REPLACE(wine_images.image, ' ', '%20' )) AS wine_photo_thumb",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_ORIGINAL_PATH,"/")+"',REPLACE(wine_images.image, ' ', '%20' )) AS wine_photo",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_ORIGINAL_PATH,"/")+"',GET_DEFAULT_WINE_IMAGE(wines_description.type,wines_description.color)) AS default_image",
            "(CASE WHEN EXISTS (SELECT * FROM user_archive AS ua2 WHERE customer_id = :customer_id AND archive_type = :favorite_value AND ua2.wine_id = ua1.wine_id) THEN true ELSE false END) AS is_favorite"
        ];

        if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.MOBILE){
            columns.push("wines.critic_rate");
            columns.push("wines.average_rate");
            columns.push("wines_description.producer");
            columns.push("wines_description.style");
            columns.push("wines.score");
        }

        var query = "SELECT " +
                columns.join(", ")+ " " +
            "FROM user_archive AS ua1 " +
            "INNER JOIN wines ON wines.id = ua1.wine_id AND wines.is_deleted = :is_deleted " +
            "INNER JOIN wines_description ON wines_description.id = wines.wine_description_id AND wines_description.is_deleted = :is_deleted " +
            "LEFT OUTER JOIN grapes ON wines_description.grape_id = grapes.id " +
            "LEFT OUTER JOIN countries ON wines_description.country_id = countries.id " +
            "LEFT OUTER JOIN wine_types ON wines_description.type_id = wine_types.id " +
            "LEFT OUTER JOIN my_notes ON my_notes.wine_id = wines.id AND my_notes.customer_id = :customer_id " +
            "LEFT OUTER JOIN rating_menu ON rating_menu.wine_id = wines.id AND rating_menu.customer_id = :customer_id " +
            "LEFT OUTER JOIN my_wine_photos ON my_wine_photos.wine_id = wines.id AND my_wine_photos.customer_id = :customer_id " +
            "LEFT OUTER JOIN wine_images ON wine_images.wine_id = ua1.wine_id AND wine_images.featured_image=1 " +
            "WHERE ua1.customer_id = :customer_id AND archive_type = :user_archive_type " +
            "ORDER BY ua1.add_date DESC ";

        if(pageNo > 0 && noOfRecords > 0){
            startIndex = (pageNo - 1) * noOfRecords;
            query += "LIMIT :start_index, :offset";
        }

        models.sequelize.query(query,
            {
                replacements:{
                    customer_id:request.token.customer_id,
                    user_archive_type:constants.USER_ARCHIVE_TYPE.VIN_IN,
                    favorite_value:constants.USER_ARCHIVE_TYPE.MY_FAVORITE,
                    is_deleted:0,
                    start_index:startIndex,
                    offset:parseInt(noOfRecords) + 1
                },
                type: models.Sequelize.QueryTypes.SELECT
            }
        ).then(function (vinWines) {
            var nextPage = false;

            if(pageNo > 0 && noOfRecords > 0){
                if(vinWines.length == (parseInt(noOfRecords) + 1)){
                    nextPage = true;
                    vinWines.pop();
                }
            }

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({wines: vinWines,next_page:nextPage})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    },

    getFavList:function (request, response) {
        var pageNo = 0;
        var noOfRecords = 0;
        var startIndex = 0;

        if(Utility.isNull(request.params.page_no) == false){
            pageNo = request.params.page_no;
        }

        if(Utility.isNull(request.params.no_of_records) == false){
            noOfRecords = request.params.no_of_records;
        }

        var columns = [
            "ua1.id AS archive_id",
            "ua1.menu_id",
            "ua1.add_date",
            "wines.id AS wine_id",
            "wines.vintage",
            "wines_description.name AS wine_name",
            "wines.description AS wine_description",
            "grapes.grape",
            "countries.country",
            "my_notes.note",
            "rating_menu.rate",
            "wines_description.type",
            "wines_description.color",
            "wines.price",
            "wines_description.region",
            "CONCAT('"+path.join(constants.IMAGE_PATH.MY_WINES_THUMB_PATH,"/")+"',REPLACE(my_wine_photos.photo, ' ', '%20' )) AS user_uploaded_photo_thumb",
            "CONCAT('"+path.join(constants.IMAGE_PATH.MY_WINES_ORIGINAL_PATH,"/")+"',REPLACE(my_wine_photos.photo, ' ', '%20' )) AS user_uploaded_photo",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_THUMB_PATH,"/")+"',REPLACE(wine_images.image, ' ', '%20' )) AS wine_photo_thumb",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_ORIGINAL_PATH,"/")+"',REPLACE(wine_images.image, ' ', '%20' )) AS wine_photo",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_ORIGINAL_PATH,"/")+"',GET_DEFAULT_WINE_IMAGE(wines_description.type,wines_description.color)) AS default_image"
        ];

        if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.MOBILE){
            columns.push("wines.critic_rate");
            columns.push("wines.average_rate");
            columns.push("wines_description.producer");
            columns.push("wines_description.style");
            columns.push("true AS is_favorite");
            columns.push("wines.score");
        }else{
            columns.push("(SELECT GROUP_CONCAT(archive_type) FROM user_archive AS ua2 WHERE customer_id = :customer_id AND ua2.wine_id = ua1.wine_id AND ua2.archive_type!=:user_archive_type) AS archive_type");
        }

        var query = "SELECT " +
                columns.join(", ")+ " " +
            "FROM user_archive AS ua1 " +
            "INNER JOIN wines ON wines.id = ua1.wine_id AND wines.is_deleted = :is_deleted " +
            "INNER JOIN wines_description ON wines_description.id = wines.wine_description_id AND wines_description.is_deleted = :is_deleted " +
            "LEFT OUTER JOIN grapes ON wines_description.grape_id = grapes.id " +
            "LEFT OUTER JOIN countries ON wines_description.country_id = countries.id " +
            "LEFT OUTER JOIN wine_types ON wines_description.type_id = wine_types.id " +
            "LEFT OUTER JOIN my_notes ON my_notes.wine_id = ua1.wine_id AND my_notes.customer_id = :customer_id " +
            "LEFT OUTER JOIN rating_menu ON rating_menu.wine_id = wines.id AND rating_menu.customer_id = :customer_id " +
            "LEFT OUTER JOIN my_wine_photos ON my_wine_photos.wine_id = ua1.wine_id AND my_wine_photos.customer_id = :customer_id " +
            "LEFT OUTER JOIN wine_images ON wine_images.wine_id = ua1.wine_id AND wine_images.featured_image=1 " +
            "WHERE ua1.customer_id = :customer_id AND ua1.archive_type = :user_archive_type " +
            "ORDER BY ua1.add_date DESC ";

        if(pageNo > 0 && noOfRecords > 0){
            startIndex = (pageNo - 1) * noOfRecords;
            query += "LIMIT :start_index, :offset";
        }

        models.sequelize.query(query,
            {
                replacements:{
                    customer_id:request.token.customer_id,
                    user_archive_type:constants.USER_ARCHIVE_TYPE.MY_FAVORITE,
                    is_deleted:0,
                    start_index:startIndex,
                    offset:parseInt(noOfRecords) + 1
                },
                type: models.Sequelize.QueryTypes.SELECT
            }
        ).then(function (myFavWineList) {
            var nextPage = false;

            if(pageNo > 0 && noOfRecords > 0){
                if(myFavWineList.length == (parseInt(noOfRecords) + 1)){
                    nextPage = true;
                    myFavWineList.pop();
                }
            }

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({wines: myFavWineList,next_page:nextPage})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    },

    addArchiveNote:function (request, response) {
        var dbErrorCallBack = function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        };

        models.UserArchive.count({
            where:{
                wine_id:request.body.wine_id,
                customer_id:request.token.customer_id
            }
        }).then(function (count) {
            var vccResponse = new VccResponse(response);

            if(count){
                var addDate = moment.utc();
                var callback = function () {
                    vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                        .send();
                };

                models.MyNotes.findOrCreate({
                    where:{
                        customer_id:request.token.customer_id,
                        wine_id:request.body.wine_id
                    },
                    defaults:{
                        customer_id:request.token.customer_id,
                        wine_id:request.body.wine_id,
                        menu_id:0,
                        note:request.body.note,
                        add_date:addDate,
                        edit_date:addDate
                    }

                }).spread(function (myNote, created) {
                    if(!created){
                        myNote.update(
                            {
                                note:request.body.note,
                                edit_date:addDate
                            },
                            {
                                fields:[
                                    "note",
                                    "edit_date"
                                ]
                            }
                        ).then(function () {
                            callback();
                        }).catch(function (error) {
                            dbErrorCallBack(error);
                        })
                    }else{
                        callback();
                    }
                }).catch(function (error) {
                    dbErrorCallBack(error);
                })
            }else{
                vccResponse.setStatusCode(VccResponse.RECORD_NOT_EXIST)
                    .setResponseBody({error: constants.ERROR_MESSAGES.ARCHIVE_RECORD_NOT_FOUND})
                    .send();
            }
        }).catch(function (error) {
            dbErrorCallBack(error);
        })
    },

    getAllArchiveWines:function (request, response) {
        var pageNo = 0;
        var noOfRecords = 0;
        var startIndex = 0;

        if(Utility.isNull(request.params.page_no) == false){
            pageNo = request.params.page_no;
        }

        if(Utility.isNull(request.params.no_of_records) == false){
            noOfRecords = request.params.no_of_records;
        }

        var columns = [
            "user_archive.id AS archive_id",
            "user_archive.menu_id",
            "user_archive.add_date",
            "wines.id AS wine_id",
            "wines.vintage",
            "wines_description.name AS wine_name",
            "wines.description AS wine_description",
            "grapes.grape",
            "countries.country",
            "my_notes.note",
            "rating_menu.rate",
            "wines_description.type",
            "wines_description.color",
            "wines.price",
            "wines_description.region",
            "CONCAT('"+path.join(constants.IMAGE_PATH.MY_WINES_THUMB_PATH,"/")+"',REPLACE(my_wine_photos.photo, ' ', '%20' )) AS user_uploaded_photo_thumb",
            "CONCAT('"+path.join(constants.IMAGE_PATH.MY_WINES_ORIGINAL_PATH,"/")+"',REPLACE(my_wine_photos.photo, ' ', '%20' )) AS user_uploaded_photo",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_THUMB_PATH,"/")+"',REPLACE(wine_images.image, ' ', '%20' )) AS wine_photo_thumb",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_ORIGINAL_PATH,"/")+"',REPLACE(wine_images.image, ' ', '%20' )) AS wine_photo",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_ORIGINAL_PATH,"/")+"',GET_DEFAULT_WINE_IMAGE(wines_description.type,wines_description.color)) AS default_image",
            "GROUP_CONCAT(archive_type) AS archive_type "
        ];

        if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.MOBILE){
            columns.push("wines.critic_rate");
            columns.push("wines.average_rate");
            columns.push("wines_description.producer");
            columns.push("wines_description.style");
            columns.push("wines.score");
        }

        var query = "SELECT " +
                columns.join(", ")+ " " +
            "FROM user_archive " +
            "INNER JOIN wines ON wines.id = user_archive.wine_id AND wines.is_deleted = :is_deleted " +
            "INNER JOIN wines_description ON wines_description.id = wines.wine_description_id AND wines_description.is_deleted = :is_deleted " +
            "LEFT OUTER JOIN grapes ON wines_description.grape_id = grapes.id " +
            "LEFT OUTER JOIN countries ON wines_description.country_id = countries.id " +
            "LEFT OUTER JOIN wine_types ON wines_description.type_id = wine_types.id " +
            "LEFT OUTER JOIN my_notes ON my_notes.wine_id = user_archive.wine_id AND my_notes.customer_id = :customer_id " +
            "LEFT OUTER JOIN rating_menu ON rating_menu.wine_id = wines.id AND rating_menu.customer_id = :customer_id " +
            "LEFT OUTER JOIN my_wine_photos ON my_wine_photos.wine_id = user_archive.wine_id AND my_wine_photos.customer_id = :customer_id " +
            "LEFT OUTER JOIN wine_images ON wine_images.wine_id = user_archive.wine_id AND wine_images.featured_image=1 " +
            "WHERE user_archive.customer_id = :customer_id AND IS_VALID_MENU(user_archive.menu_id) = 1 " +
            "GROUP BY user_archive.wine_id " +
            "ORDER BY user_archive.add_date DESC ";

        if(pageNo > 0 && noOfRecords > 0){
            startIndex = (pageNo - 1) * noOfRecords;
            query += "LIMIT :start_index, :offset";
        }

        models.sequelize.query(query,
            {
                replacements:{
                    customer_id:request.token.customer_id,
                    user_archive_type:constants.USER_ARCHIVE_TYPE.MY_FAVORITE,
                    is_deleted:0,
                    start_index:startIndex,
                    offset:parseInt(noOfRecords) + 1
                },
                type: models.Sequelize.QueryTypes.SELECT
            }
        ).then(function (allWines) {
            var nextPage = false;

            if(pageNo > 0 && noOfRecords > 0){
                if(allWines.length == (parseInt(noOfRecords) + 1)){
                    nextPage = true;
                    allWines.pop();
                }
            }

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({wines: allWines,next_page:nextPage})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    },

    addArchiveRate:function (request, response) {
        var dbErrorCallBack = function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        };

        async.waterfall([
            function (callback) {
                models.UserArchive.count({
                    where:{
                        wine_id:request.body.wine_id,
                        customer_id:request.token.customer_id
                    }
                }).then(function (count){
                    callback(null,count);
                }).catch(models.sequelize.Error,function (error) {
                   callback(error);
                });
            },
            function (count, callback) {
                if(count>0){
                    var addDate = moment.utc();

                    models.RatingMenu.findOrCreate({
                        where:{
                            customer_id:request.token.customer_id,
                            wine_id:request.body.wine_id
                        },
                        defaults:{
                            customer_id:request.token.customer_id,
                            wine_id:request.body.wine_id,
                            rate:request.body.rate,
                            web:(Utility.getDeviceTypeFromUserAgent(request) == constants.DEVICE_TYPE.WEB)?1:0,
                            date:addDate
                        }

                    }).spread(function (ratingMenu, created) {
                        if(!created){
                            ratingMenu.update(
                                {
                                    rate:request.body.rate,
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
                                callback(null,VccResponse.SUCCESS_CODE);
                            }).catch(function (error) {
                                callback(error);
                            });
                        }else{
                            vincompassController.addGamificationPoint(constants.GAMIFICATION_EVENT_TYPE.WINE_RATED,[request.body.wine_id],request.token.customer_id,request,function () {
                                callback(null,VccResponse.SUCCESS_CODE);
                            });
                        }
                    }).catch(function (error) {
                        callback(error);
                    });
                }else{
                    callback(null,VccResponse.RECORD_NOT_EXIST);
                }
            },
            function (statusCode, callback) {
                if(statusCode == VccResponse.SUCCESS_CODE){
                    models.RatingMenu.findAll({
                        attributes:[
                            [models.sequelize.fn('AVG', models.sequelize.col('rate')), 'avg_rate']
                        ],
                        where:{
                            wine_id:request.body.wine_id
                        },
                        group:"wine_id",
                        raw:true
                    }).then(function (result) {
                        if(Utility.isNull(result) == false && result.length > 0){
                            callback(null,statusCode,result[0].avg_rate);
                        }else{
                            callback(null,statusCode,null);
                        }
                    }).catch(function (error) {
                        Logger.logDbError(error,request);
                        callback(null,statusCode,null);
                    })
                }else{
                    callback(null,statusCode,null);
                }
            },
            function (statusCode, avgRate, callback) {
                if(statusCode == VccResponse.SUCCESS_CODE && Utility.isNull(avgRate) == false){
                    models.sequelize.query("UPDATE wines " +
                        "SET average_rate = :avg_rate " +
                        "WHERE id=:wine_id",{
                        replacements:{
                            wine_id:request.body.wine_id,
                            avg_rate:avgRate
                        }
                    }).then(function () {
                        callback(null,{status_code:statusCode,avg_rate:avgRate});
                    }).catch(function (error) {
                        Logger.logDbError(error,request);
                        callback(null,{status_code:statusCode,avg_rate:null});
                    });
                }else{
                    callback(null,{status_code:statusCode,avg_rate:null});
                }
            }
        ],function (error, results) {
            if(error){
                dbErrorCallBack(error);
            }else{
                var vccResponse = new VccResponse(response);

                if(results.status_code == VccResponse.SUCCESS_CODE){
                    vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                        .setResponseBody((Utility.isNull(results.avg_rate) == false)?{avg_rate:results.avg_rate}:null)
                        .send();
                }else if(results.status_code == VccResponse.RECORD_NOT_EXIST){
                    vccResponse.setStatusCode(VccResponse.RECORD_NOT_EXIST)
                        .setResponseBody({error: constants.ERROR_MESSAGES.ARCHIVE_RECORD_NOT_FOUND})
                        .send();
                }else{
                    vccResponse.setStatusCode(VccResponse.UNKNOWN_ERROR)
                        .send();
                }
            }
        });

        // models.UserArchive.count({
        //     where:{
        //         wine_id:request.body.wine_id,
        //         customer_id:request.token.customer_id
        //     }
        // }).then(function (count){
        //     var vccResponse = new VccResponse(response);
        //
        //     if(count>0){
        //         var addDate = moment.utc();
        //         var callback = function (rateCount) {
        //             if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.MOBILE){
        //                 vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
        //                     .setResponseBody({count:rateCount})
        //                     .send();
        //             }else{
        //                 vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
        //                     .send();
        //             }
        //         };
        //
        //         async.series(
        //             {
        //                 rateMenu:function (callback)
        //                 {
        //                     models.RatingMenu.findOrCreate({
        //                         where:{
        //                             customer_id:request.token.customer_id,
        //                             wine_id:request.body.wine_id
        //                         },
        //                         defaults:{
        //                             customer_id:request.token.customer_id,
        //                             wine_id:request.body.wine_id,
        //                             rate:request.body.rate,
        //                             web:(Utility.getDeviceTypeFromUserAgent(request) == constants.DEVICE_TYPE.WEB)?1:0,
        //                             date:addDate
        //                         }
        //
        //                     }).spread(function (ratingMenu, created) {
        //                         if(!created){
        //                             ratingMenu.update(
        //                                 {
        //                                     rate:request.body.rate,
        //                                     web:1,
        //                                     date:addDate
        //                                 },
        //                                 {
        //                                     fields:[
        //                                         "rate",
        //                                         "web",
        //                                         "date"
        //                                     ]
        //                                 }
        //                             ).then(function () {
        //                                 callback(null,null);
        //                             }).catch(function (error) {
        //                                 callback(error,null);
        //                             });
        //                         }else{
        //                             vincompassController.addGamificationPoint(constants.GAMIFICATION_EVENT_TYPE.WINE_RATED,[request.body.wine_id],request.token.customer_id,request,function () {
        //                                 callback(null,null);
        //                             });
        //                         }
        //                     }).catch(function (error) {
        //                         callback(error,null);
        //                     });
        //                 },
        //                 rateCount:function (callback) {
        //                     if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.MOBILE) {
        //                         models.RatingMenu.count({
        //                             where: {
        //                                 customer_id: request.token.customer_id
        //                             }
        //                         }).then(function (count) {
        //                             callback(null, count);
        //                         }).catch(function (error) {
        //                             Logger.logError(error, request);
        //                             callback(null, 0);
        //                         });
        //                     }else{
        //                         callback(null,0);
        //                     }
        //                 }
        //             },
        //             function (error, results) {
        //                 if(error){
        //                     dbErrorCallBack(error);
        //                 } else{
        //                     callback(results.rateCount);
        //                 }
        //             }
        //         );
        //     }else{
        //         vccResponse.setStatusCode(VccResponse.RECORD_NOT_EXIST)
        //             .setResponseBody({error: constants.ERROR_MESSAGES.ARCHIVE_RECORD_NOT_FOUND})
        //             .send();
        //     }
        // }).catch(function (error) {
        //     dbErrorCallBack(error);
        // });
    },

    removeArchive:function (request, response) {
        var where;
        var wineArchiveEntries = [];
        var deletedWineCount = 0;

        if(request.body.archive_type == constants.ALL){
            where = {
                wine_id:{
                    $in:request.body.wine_ids
                },
                customer_id:request.token.customer_id
            };
        }else{
            where = {
                wine_id:{
                    $in:request.body.wine_ids
                },
                customer_id:request.token.customer_id,
                archive_type:request.body.archive_type
            };
        }

        async.series(
            {
                archiveTypes:function (callback) {
                    models.UserArchive.findAll({
                        attributes:[
                            "wine_id",
                            "archive_type"
                        ],
                        where:where,
                        raw:true
                    }).then(function (userArchiveWineList) {
                        wineArchiveEntries = userArchiveWineList;
                        callback(null,null);
                    }).catch(function (error) {
                        Logger.logDbError(error,request);

                        callback(null,null);
                    })
                },
                deleteRecords:function (callback) {
                    models.UserArchive.destroy({
                        where:where
                    }).then(function (deletedRows) {
                        deletedWineCount = deletedRows;
                        callback(null,null);
                    }).catch(function (error) {
                        Logger.logDbError(error,request);

                        callback(error,null);
                    });
                },
                gamificationCalulation:function (callback) {
                    if(deletedWineCount>0){
                        var calFunctionArray = [];

                        if(request.body.archive_type == constants.ALL){
                            for (var i=0;i<wineArchiveEntries.length;i++){
                                console.log(1);
                                var detail = wineArchiveEntries[i];

                                if(detail.archive_type == constants.USER_ARCHIVE_TYPE.VIN_IN ||
                                    detail.archive_type == constants.USER_ARCHIVE_TYPE.VIN_OUT){

                                    calFunctionArray[i] = function (callback) {
                                        vincompassController.deleteGamificationPoint(constants.GAMIFICATION_EVENT_TYPE.WINE_ARCHIVE,[detail.wine_id],request,function () {
                                            callback(null,null);
                                        })
                                    }
                                }else{
                                    calFunctionArray[i] = function (callback) {
                                        vincompassController.deleteGamificationPoint(constants.GAMIFICATION_EVENT_TYPE.FAVORITE_WINE,[detail.wine_id],request,function () {
                                            callback(null,null);
                                        })
                                    }
                                }
                            }
                        }else{
                            if(request.body.archive_type == constants.USER_ARCHIVE_TYPE.VIN_IN ||
                                request.body.archive_type == constants.USER_ARCHIVE_TYPE.VIN_OUT){

                                calFunctionArray[0] = function (callback) {
                                    vincompassController.deleteGamificationPoint(constants.GAMIFICATION_EVENT_TYPE.WINE_ARCHIVE,request.body.wine_ids,request,function () {
                                        callback(null,null);
                                    })
                                }
                            }else{
                                calFunctionArray[0] = function (callback) {
                                    vincompassController.deleteGamificationPoint(constants.GAMIFICATION_EVENT_TYPE.FAVORITE_WINE,request.body.wine_ids,request,function () {
                                        callback(null,null);
                                    })
                                }
                            }
                        }

                        async.series(calFunctionArray, function (error, results) {
                            callback(null,null);
                        });
                    }else{
                        callback(null,null);
                    }
                }
            },
            function (error, results) {
                var vccResponse = new VccResponse(response);

                if(error){
                    Logger.logDbError(error,request);

                    vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                        .send();
                }else{
                    if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.MOBILE){
                        models.UserArchive.count({
                            where:{
                                customer_id: request.token.customer_id,
                                archive_type:{
                                    $or:[constants.USER_ARCHIVE_TYPE.VIN_IN,constants.USER_ARCHIVE_TYPE.VIN_OUT]
                                }
                            }
                        }).then(function (count) {
                            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                                .setResponseBody({wines_in_archive:count})
                                .send();
                        }).catch(function (error) {
                            Logger.logDbError(error,request);

                            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                                .send();
                        });
                    }else{
                        vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                            .send();
                    }
                }
            }
        );
    },

    nameLookUp:function (request, response) {
        var query = "";
        var joins = "";
        var wineDescriptionJoin = "";
        var whereCondition = "wines_description.name LIKE :wine_name AND ";

        query = "SELECT " +
                "DISTINCT wines_description.name " +
            "FROM wines ";

        joins += "INNER JOIN wines_description ON wines.wine_description_id = wines_description.id ";

        if(validate.isEmpty(request.body.country) == false){
            joins += "AND wines_description.country = :wine_country ";
        }

        if(validate.isEmpty(request.body.region) == false){
            joins += "AND wines_description.region = :wine_region ";
        }

        if(validate.isEmpty(request.body.grape) == false){
            joins += "AND wines_description.grape = :wine_grape ";
        }

        if(validate.isEmpty(request.body.rest_city) == false ||
            validate.isEmpty(request.body.rest_cuisine) == false ||
            validate.isEmpty(request.body.rest_name) == false){

            joins += "INNER JOIN menu ON menu.wine_id = wines.id ";
            joins += "INNER JOIN restaurants ON menu.restaurant_id = restaurants.id ";

            if(validate.isEmpty(request.body.rest_city) == false){
                joins += "AND restaurants.city LIKE :rest_city ";
            }

            if(validate.isEmpty(request.body.rest_cuisine) == false){
                joins += "AND restaurants.cuisine LIKE :rest_cuisine ";
            }

            if(validate.isEmpty(request.body.rest_name) == false){
                joins += "AND restaurants.name LIKE :rest_name ";
            }
        }

        if(validate.isEmpty(request.body.min_price) == false &&
            validate.isEmpty(request.body.max_price) == false){
            whereCondition += "wines.price BETWEEN :wine_min_price AND :wine_max_price AND ";
        }

        if(validate.isEmpty(request.body.vintage) == false){
            whereCondition += "wines.vintage = :wine_vintage AND ";
        }

        query += joins;

        if(validate.isEmpty(whereCondition) == false){
            query += "WHERE "+whereCondition.substr(0,whereCondition.length - 4);
        }

        query += "ORDER BY wines.id ";
        query += "LIMIT 50 ";

        models.sequelize.query(query,{
            replacements:{
                wine_country:request.body.country,
                wine_region:request.body.region,
                wine_grape:request.body.grape,
                wine_min_price:request.body.min_price,
                wine_max_price:request.body.max_price,
                wine_vintage:request.body.vintage,
                wine_name:"%"+request.body.search_str+"%",
                rest_city:"%"+request.body.rest_city+"%",
                rest_cuisine:"%"+request.body.rest_cuisine+"%",
                rest_name:"%"+request.body.rest_name+"%"
            },
            type: models.Sequelize.QueryTypes.SELECT
        }).then(function (wineNameList) {
            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({wine_names: wineNameList})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        })
    },

    addArchivePhoto:function (request, response) {
        var dbErrorCallBack = function (error) {
            Logger.logDbError(error,request);

            Utility.removeFile(request.file.path);
            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        };

        models.UserArchive.count({
            where:{
                wine_id:request.body.wine_id,
                customer_id:request.token.customer_id
            }
        }).then(function (count) {
            var vccResponse = new VccResponse(response);

            if(count > 0){
                var addDate = moment.utc();
                var callback = function () {
                    vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                        .setResponseBody({
                            user_uploaded_photo_thumb:path.join(constants.IMAGE_PATH.MY_WINES_THUMB_PATH,"/",request.file.filename),
                            user_uploaded_photo:path.join(constants.IMAGE_PATH.MY_WINES_ORIGINAL_PATH,"/",request.file.filename)
                        }).send();
                };

                models.MyWinePhotos.findOrCreate({
                    where:{
                        customer_id:request.token.customer_id,
                        wine_id:request.body.wine_id
                    },
                    defaults:{
                        customer_id:request.token.customer_id,
                        wine_id:request.body.wine_id,
                        menu_id:0,
                        photo:request.file.filename,
                        upload_date:addDate
                    }
                }).spread(function (myWinePhoto, created) {
                    if(!created){
                        var existFileName = myWinePhoto.photo;
                        myWinePhoto.update(
                            {
                                photo:request.file.filename,
                                upload_date:addDate
                            },
                            {
                                fields:[
                                    "photo",
                                    "upload_date"
                                ]
                            }
                        ).then(function () {
                            Utility.removeFile(appRoot+constants.PHYSICAL_IMAGE_PATH.MY_WINES_THUMB_PATH+"/"+existFileName);
                            Utility.removeFile(appRoot+constants.PHYSICAL_IMAGE_PATH.MY_WINES_ORIGINAL_PATH+"/"+existFileName);
                            callback();
                        }).catch(function (error) {
                            dbErrorCallBack(error);
                        });
                    }else{
                        callback();
                    }
                }).catch(function (error) {
                    dbErrorCallBack(error);
                })
            }else{
                Utility.removeFile(request.file.path);
                vccResponse.setStatusCode(VccResponse.RECORD_NOT_EXIST)
                    .setResponseBody({error: constants.ERROR_MESSAGES.ARCHIVE_RECORD_NOT_FOUND})
                    .send();
            }
        }).catch(function (error) {
            dbErrorCallBack(error);
        });
    },
    searchWine:function (request, response) {
        var query = "";
        var whereCondition = "";
        var joins = "";

        var columns = [
            "wines.id AS wine_id",
            "wines.vintage",
            "wines_description.name AS wine_name",
            "wines.description AS wine_description",
            "wines_description.grape",
            "wines_description.country",
            "my_notes.note",
            "rating_menu.rate",
            "wines_description.type",
            "wines_description.color",
            "wines.price",
            "wines_description.region",
            "wines.score",
            "CONCAT('"+path.join(constants.IMAGE_PATH.MY_WINES_THUMB_PATH,"/")+"',REPLACE(my_wine_photos.photo, ' ', '%20' )) AS user_uploaded_photo_thumb",
            "CONCAT('"+path.join(constants.IMAGE_PATH.MY_WINES_ORIGINAL_PATH,"/")+"',REPLACE(my_wine_photos.photo, ' ', '%20' )) AS user_uploaded_photo",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_THUMB_PATH,"/")+"',REPLACE(wine_images.image, ' ', '%20' )) AS wine_photo_thumb",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_ORIGINAL_PATH,"/")+"',REPLACE(wine_images.image, ' ', '%20' )) AS wine_photo",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_ORIGINAL_PATH,"/")+"',GET_DEFAULT_WINE_IMAGE(wines_description.type,wines_description.color)) AS default_image",
            "GROUP_CONCAT(archive_type) AS archive_type"
        ];

        if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.MOBILE){
            columns.push("wines.critic_rate");
            columns.push("wines.average_rate");
            columns.push("wines_description.producer");
            columns.push("wines_description.style");
        }

        query = "SELECT " +
            columns.join(", ")+ " " +
        "FROM wines ";

        joins += "INNER JOIN wines_description ON wines_description.id = wines.wine_description_id AND wines_description.name LIKE :wine_name ";

        if(validate.isEmpty(request.body.country) == false){
            joins += "AND wines_description.country = :country ";
        }

        if(validate.isEmpty(request.body.region) == false){
            joins += "AND wines_description.region = :region ";
        }

        if(validate.isEmpty(request.body.grape) == false){
            joins += "AND wines_description.grape = :grape ";
        }

        if(validate.isEmpty(request.body.color) == false){
            joins += "AND wines_description.color = :color ";
        }

        if(validate.isEmpty(request.body.vintage) == false){
            whereCondition += "wines.vintage = :vintage AND ";
        }

        joins += "LEFT OUTER JOIN user_archive ON user_archive.wine_id = wines.id AND user_archive.customer_id = :customer_id ";
        joins += "LEFT OUTER JOIN my_wine_photos ON my_wine_photos.wine_id = wines.id AND my_wine_photos.customer_id = :customer_id ";
        joins += "LEFT OUTER JOIN wine_images ON wine_images.wine_id = wines.id AND wine_images.featured_image=1 ";
        joins += "LEFT OUTER JOIN my_notes ON my_notes.wine_id = wines.id AND my_notes.customer_id = :customer_id ";
        joins += "LEFT OUTER JOIN rating_menu ON rating_menu.wine_id = wines.id AND rating_menu.customer_id = :customer_id ";

        query += joins;

        if(validate.isEmpty(whereCondition) == false){
            query += "WHERE "+whereCondition.substr(0,whereCondition.length - 4);
        }

        query += "GROUP BY wines.id ";
        query += "ORDER BY wines.id ";
        query += "LIMIT 50 ";

        models.sequelize.query(query,{
            replacements:{
                customer_id:request.token.customer_id,
                wine_name:"%"+request.body.search_str+"%",
                country:request.body.country,
                region:request.body.region,
                grape:request.body.grape,
                color:request.body.color,
                vintage:request.body.vintage
            },
            type: models.Sequelize.QueryTypes.SELECT
        }).then(function (wineList) {
            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({wines: wineList})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    },
    getVintageList:function (request, response) {
        models.Wines.findAll({
            attributes:[
                [models.Sequelize.literal('DISTINCT vintage'), 'vintage']
            ],
            where:{
                vintage:{
                    $notIn:['','NV']
                }
            },
            raw:true
        }).then(function (vintageList) {
            var vccResponse = new VccResponse(response);
            var vintageArray = vintageList.sort().reverse().slice(0,50);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({vintage_list: vintageArray})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    },
    addToArchive:function (request, response) {
        var addDate = moment.utc();
        var vccResponse = new VccResponse(response);

        var dbErrorCallback = function (error) {
            Logger.logDbError(error,request);

            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        };
        var addArchiveCallBack = function () {
            models.UserArchiveHistory.create({
                customer_id: request.token.customer_id,
                menu_id:request.body.menu_id,
                wine_id: request.body.wine_id,
                food_id:request.body.food_id,
                archive_type:request.body.archive_type,
                vin_type:request.body.vin_type,
                source:0,
                add_date: addDate
            }).then(function (userArchiveHistory) {
                if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.MOBILE){
                    models.UserArchive.count({
                        where:{
                            customer_id: request.token.customer_id,
                            archive_type:{
                                $or:[constants.USER_ARCHIVE_TYPE.VIN_IN,constants.USER_ARCHIVE_TYPE.VIN_OUT]
                            }
                        }
                    }).then(function (count) {
                        vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                            .setResponseBody({wines_in_archive:count})
                            .send();
                    }).catch(function (error) {
                        Logger.logDbError(error,request);

                        vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                            .send();
                    });
                }else{
                    vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                        .send();
                }
            }).catch(function (error) {
                dbErrorCallback(error);
            });
        };

        models.UserArchive.findOrCreate({
            where:{
                wine_id:request.body.wine_id,
                customer_id:request.token.customer_id,
                archive_type:request.body.archive_type
            },
            defaults:{
                menu_id:request.body.menu_id,
                wine_id:request.body.wine_id,
                food_id:request.body.food_id,
                customer_id:request.token.customer_id,
                archive_type:request.body.archive_type,
                source:0,
                add_date:addDate
            }
        }).spread(function (userArchive, isCreated) {
            if(!isCreated){
                userArchive.update(
                    {
                        add_date:addDate
                    },
                    {
                        fields:[
                            "add_date"
                        ]
                    }
                ).then(function () {
                    addArchiveCallBack();
                }).catch(function (error) {
                    dbErrorCallback(error);
                })
            }else{
                var eventType = constants.GAMIFICATION_EVENT_TYPE.WINE_ARCHIVE;

                if(request.body.archive_type == constants.USER_ARCHIVE_TYPE.MY_FAVORITE){
                    eventType = constants.GAMIFICATION_EVENT_TYPE.FAVORITE_WINE;
                }

                vincompassController.addGamificationPoint(eventType,[request.body.wine_id],request.token.customer_id,request,function () {
                    addArchiveCallBack();
                });
            }
        }).catch(function (error) {
            dbErrorCallback(error);
        })
    },

    getVinOutByRestaurantId:function (request,response) {
        var columns = [
            "ua1.id AS archive_id",
            "ua1.menu_id",
            "ua1.add_date",
            "wines.id AS wine_id",
            "wines.vintage",
            "wines_description.name AS wine_name",
            "wines.description AS wine_description",
            "grapes.grape",
            "countries.country",
            "my_notes.note",
            "rating_menu.rate",
            "wines_description.type",
            "wines_description.color",
            "menu.price",
            "wines_description.region",
            "wines.score",
            "CONCAT('"+path.join(constants.IMAGE_PATH.MY_WINES_THUMB_PATH,"/")+"',REPLACE(my_wine_photos.photo, ' ', '%20' )) AS user_uploaded_photo_thumb",
            "CONCAT('"+path.join(constants.IMAGE_PATH.MY_WINES_ORIGINAL_PATH,"/")+"',REPLACE(my_wine_photos.photo, ' ', '%20' )) AS user_uploaded_photo",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_THUMB_PATH,"/")+"',REPLACE(wine_images.image, ' ', '%20' )) AS wine_photo_thumb",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_ORIGINAL_PATH,"/")+"',REPLACE(wine_images.image, ' ', '%20' )) AS wine_photo",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_ORIGINAL_PATH,"/")+"',GET_DEFAULT_WINE_IMAGE(wines_description.type,wines_description.color)) AS default_image",
            "(CASE WHEN EXISTS (SELECT * FROM user_archive AS ua2 WHERE customer_id = :customer_id AND archive_type = :favorite_value AND ua2.wine_id = ua1.wine_id) THEN true ELSE false END) AS is_favorite"
        ];

        if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.MOBILE){
            columns.push("wines.critic_rate");
            columns.push("wines.average_rate");
            columns.push("wines_description.producer");
            columns.push("wines_description.style");
        }

        var query = "SELECT " +
                columns.join(", ")+ " " +
            "FROM user_archive AS ua1 " +
            "INNER JOIN wines ON wines.id = ua1.wine_id " +
            "INNER JOIN menu ON ua1.menu_id = menu.id AND menu.is_deleted = :is_deleted AND menu.active = :active AND (ua1.menu_id>0 AND restaurant_id=:restaurant_id) " +
            "INNER JOIN wines_description ON wines_description.id = wines.wine_description_id " +
            "LEFT OUTER JOIN grapes ON wines_description.grape_id = grapes.id " +
            "LEFT OUTER JOIN countries ON wines_description.country_id = countries.id " +
            "LEFT OUTER JOIN wine_types ON wines_description.type_id = wine_types.id " +
            "LEFT OUTER JOIN my_notes ON my_notes.wine_id = wines.id AND my_notes.customer_id = :customer_id " +
            "LEFT OUTER JOIN rating_menu ON rating_menu.wine_id = wines.id AND rating_menu.customer_id = :customer_id " +
            "LEFT OUTER JOIN my_wine_photos ON my_wine_photos.wine_id = wines.id AND my_wine_photos.customer_id = :customer_id " +
            "LEFT OUTER JOIN wine_images ON wine_images.wine_id = ua1.wine_id AND wine_images.featured_image=1 " +
            "WHERE ua1.customer_id = :customer_id AND archive_type = :user_archive_type " +
            "ORDER BY ua1.add_date DESC ";

        models.sequelize.query(query,
            {
                replacements:{
                    customer_id:request.token.customer_id,
                    user_archive_type:constants.USER_ARCHIVE_TYPE.VIN_OUT,
                    favorite_value:constants.USER_ARCHIVE_TYPE.MY_FAVORITE,
                    restaurant_id:request.params.restaurant_id,
                    active:1,
                    is_deleted:0
                },
                type: models.Sequelize.QueryTypes.SELECT
            }
        ).then(function (vinOutWines) {
            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({wines: vinOutWines})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    },

    getWinesFromRE:function (request, response) {
        var params = "?user_id="+request.token.customer_id+"&restaurant_id="+request.body.restaurant_id;

        var wineName = request.body.wine_name;
        var wineCountry = request.body.wine_country;
        var wineMinPrice = request.body.lower_price;
        var wineMaxPrice = request.body.upper_price;
        var color = request.body.color;
        var grape = request.body.grape;
        var isFavorite = false;

        var columns = [
            "menu.wine_id",
            "menu.id AS menu_id",
            "wines_description.name AS wine_name",
            "wines_description.grape",
            "wines_description.country",
            "wines.vintage",
            "wines.critic_rate",
            "wines_description.type",
            "wines_description.color",
            "menu.price",
            "wines_description.region",
            "wines.score",
            "CONCAT('"+path.join(constants.IMAGE_PATH.MY_WINES_THUMB_PATH,"/")+"',REPLACE(my_wine_photos.photo, ' ', '%20' )) AS user_uploaded_photo_thumb",
            "CONCAT('"+path.join(constants.IMAGE_PATH.MY_WINES_ORIGINAL_PATH,"/")+"',REPLACE(my_wine_photos.photo, ' ', '%20' )) AS user_uploaded_photo",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_THUMB_PATH,"/")+"',REPLACE(wine_images.image, ' ', '%20' )) AS wine_photo_thumb",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_ORIGINAL_PATH,"/")+"',REPLACE(wine_images.image, ' ', '%20' )) AS wine_photo",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_ORIGINAL_PATH,"/")+"',GET_DEFAULT_WINE_IMAGE(wines_description.type,wines_description.color)) AS default_image",
            "IF(ISNULL(user_archive.id),false,true) AS is_favorite"
        ];

        if(Utility.getSourceTypeFromUserAgent(request) === constants.SOURCE_TYPE.MOBILE){
            columns.push("wines.critic_rate");
            columns.push("wines.description AS wine_description");
            columns.push("wines_description.producer");
            columns.push("wines_description.style");
        }

        if(validate.isEmpty(request.body.is_favorite) == false && (request.body.is_favorite == true || request.body.is_favorite == 'true')){
            isFavorite = true;
        }

        if(Utility.isNull(wineName) == false && wineName.trim().length > 0){
            if(!isFavorite){
                params += "&wine_name="+request.body.wine_name
            }
        }

        if(Utility.isNull(wineMinPrice) == false){
            params += "&lower_price="+wineMinPrice
        }

        if(Utility.isNull(wineMaxPrice) == false){
            params += "&upper_price="+wineMaxPrice
        }

        if(Utility.isNull(color) == false && color.trim().length > 0){
            params += "&color="+request.body.color
        }

        if(Utility.isNull(grape) == false && grape.trim().length > 0){
            params += "&grape="+request.body.grape
        }

        if(Utility.isNull(request.body.food_category) == false && request.body.food_category > 0){
            params += "&category="+request.body.food_category
        }

        if(Utility.isNull(request.body.food_id) == false && request.body.food_id > 0){
            params += "&food_id="+request.body.food_id
        }

        async.waterfall([
            function (callback) {
                var query= "";

                if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.WEB){
                    if(isFavorite){
                        query = "SELECT " +
                                columns.join(", ")+ " " +
                            "FROM menu " +
                            "INNER JOIN wines ON menu.wine_id = wines.id " +
                            "INNER JOIN wines_description ON wines.wine_description_id = wines_description.id " +
                            "INNER JOIN user_archive ON wines.id = user_archive.wine_id AND archive_type=:archive_type AND customer_id=:customer_id " +
                            "LEFT OUTER JOIN my_wine_photos ON my_wine_photos.wine_id = wines.id AND my_wine_photos.customer_id = :customer_id " +
                            "LEFT OUTER JOIN wine_images ON wine_images.wine_id = wines.id AND wine_images.featured_image=1 " +
                            "WHERE menu.restaurant_id=:restaurant_id " +
                            "ORDER BY menu.price DESC ";

                        query += "LIMIT 10";

                        models.sequelize.query(query,{
                            replacements:{
                                restaurant_id:request.body.restaurant_id,
                                customer_id:request.token.customer_id,
                                archive_type:constants.USER_ARCHIVE_TYPE.MY_FAVORITE
                            },
                            type: models.Sequelize.QueryTypes.SELECT
                        }).then(function (wineList) {
                            callback(null,wineList);
                        }).catch(function (error) {
                            Logger.logDbError(error,request);
                            callback(null,[]);
                        });
                    }else if(validate.isEmpty(wineCountry) == false ||
                        validate.isEmpty(wineName) == false ||
                        validate.isEmpty(wineMinPrice) == false ||
                        validate.isEmpty(wineMaxPrice) == false){
                        var joins = "";
                        var whereCondition = "WHERE menu.restaurant_id=:restaurant_id AND ";

                        joins += "INNER JOIN wines ON menu.wine_id = wines.id " +
                            "LEFT OUTER JOIN user_archive ON wines.id = user_archive.wine_id AND archive_type=:archive_type AND customer_id=:customer_id " +
                            "LEFT OUTER JOIN my_wine_photos ON my_wine_photos.wine_id = wines.id AND my_wine_photos.customer_id = :customer_id " +
                            "LEFT OUTER JOIN wine_images ON wine_images.wine_id = wines.id AND wine_images.featured_image=1 ";

                        if(validate.isEmpty(wineCountry) == false ||
                            validate.isEmpty(wineName) == false){
                            joins += "INNER JOIN wines_description ON wines.wine_description_id = wines_description.id ";

                            if(validate.isEmpty(wineName) == false){
                                joins += "AND wines_description.name LIKE :wine_name "
                            }

                            if(validate.isEmpty(wineCountry) == false){
                                joins += "AND wines_description.country = :wine_country "
                            }
                        }

                        if(validate.isEmpty(wineMinPrice) == false &&
                            validate.isEmpty(wineMaxPrice) == false){
                            whereCondition += "menu.price BETWEEN :min_price AND :max_price AND ";
                        }

                        query = "SELECT " +
                            columns.join(", ")+ " " +
                            "FROM menu " +
                            joins +
                            whereCondition.substr(0,whereCondition.length - 4);

                        query += "ORDER BY menu.price DESC " +
                            "LIMIT 10";

                        models.sequelize.query(query,{
                            replacements:{
                                wine_name:"%"+wineName+"%",
                                wine_country:wineCountry,
                                min_price:wineMinPrice,
                                max_price:wineMaxPrice,
                                restaurant_id:request.body.restaurant_id,
                                customer_id:request.token.customer_id,
                                archive_type:constants.USER_ARCHIVE_TYPE.MY_FAVORITE
                            },
                            type: models.Sequelize.QueryTypes.SELECT
                        }).then(function (wineList) {
                            callback(null,wineList);
                        }).catch(function (error) {
                            Logger.logDbError(error,request);
                            callback(null,[]);
                        });
                    } else{
                        callback(null,[]);
                    }
                }else{
                    callback(null,[]);
                }
            },
            function (wineList, callback) {
                if(Utility.isNull(wineList)==false && wineList.length < 10){
                    curlRequest(
                        {
                            method:"GET",
                            uri:encodeURI(config.ENV_CONFIG.RE_URL+params)
                        },
                        function (error, resp, body) {
                            var wineIdArray = [];

                            if(!error){
                                console.log(body);
                                var responseBody = JSON.parse(body);

                                if(Utility.isNull(responseBody) == false && Utility.isNull(responseBody.menu) == false){
                                    var winesArray = responseBody.menu;

                                    for (var i=0;i<winesArray.length;i++){
                                        var wineIdDetail = winesArray[i];

                                        if(Utility.isNull(wineList)==false){
                                            var isExist = false;

                                            for (var j=0;j<wineList.length;j++){
                                                if(wineList[j].wine_id == wineIdDetail.wine_id){
                                                    isExist = true;
                                                    break;
                                                }
                                            }

                                            if(!isExist){
                                                wineIdArray.push(wineIdDetail.wine_id);
                                            }
                                        }else{
                                            wineIdArray.push(wineIdDetail.wine_id);
                                        }
                                    }
                                }
                            }

                            callback(null,wineList,wineIdArray);
                        }
                    );
                }else{
                    callback(null,wineList,null);
                }
            },
            function (wineList, reWineList, callback) {
                if(Utility.isNull(reWineList)==false){
                    var query = "SELECT " +
                            columns.join(", ")+ " " +
                        "FROM menu " +
                        "INNER JOIN wines ON menu.wine_id = wines.id " +
                        "INNER JOIN wines_description ON wines.wine_description_id = wines_description.id " +
                        "LEFT JOIN user_archive ON wines.id = user_archive.wine_id AND archive_type=:archive_type AND customer_id=:customer_id " +
                        "LEFT OUTER JOIN my_wine_photos ON my_wine_photos.wine_id = wines.id AND my_wine_photos.customer_id = :customer_id " +
                        "LEFT OUTER JOIN wine_images ON wine_images.wine_id = wines.id AND wine_images.featured_image=1 " +
                        "WHERE menu.wine_id IN (:wine_ids) AND restaurant_id=:restaurant_id " +
                        "ORDER BY menu.price DESC ";

                    if(Utility.isNull(wineList)==false && wineList.length>0){
                        var limit = 10 - wineList.length;

                        query += "LIMIT "+limit;
                    }

                    models.sequelize.query(query,{
                        replacements:{
                            wine_ids:reWineList,
                            restaurant_id:request.body.restaurant_id,
                            customer_id:request.token.customer_id,
                            archive_type:constants.USER_ARCHIVE_TYPE.MY_FAVORITE
                        },
                        type: models.Sequelize.QueryTypes.SELECT
                    }).then(function (wines) {
                        var combineWineList = wineList.concat(wines);
                        callback(null,combineWineList);
                    }).catch(function (error) {
                        Logger.logDbError(error,request);
                        callback(null,wineList);
                    });
                }else{
                    callback(null,wineList);
                }
            }
        ],function (error, results) {
            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({wine_list:(underscore.sortBy(results,"score")).reverse()})
                .send();
        });
    },
    getWineDetails:function (request, response) {
        var vccResponse = new VccResponse(response);
        var joins = "";
        var columns = [
            "wines.id AS wine_id",
            "wines.vintage",
            "wines_description.name AS wine_name",
            "wines.description AS wine_description",
            "grapes.grape",
            "countries.country",
            "my_notes.note",
            "rating_menu.rate",
            "wines_description.type",
            "wines_description.color",
            "wines_description.region",
            "wines.critic_rate",
            "wines.description AS description",
            "wines.geo_description AS tasting_note",
            "wines_description.producer",
            "wines_description.style",
            "wines.average_rate",
            "CONCAT('"+path.join(constants.IMAGE_PATH.MY_WINES_THUMB_PATH,"/")+"',REPLACE(my_wine_photos.photo, ' ', '%20' )) AS user_uploaded_photo_thumb",
            "CONCAT('"+path.join(constants.IMAGE_PATH.MY_WINES_ORIGINAL_PATH,"/")+"',REPLACE(my_wine_photos.photo, ' ', '%20' )) AS user_uploaded_photo",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_THUMB_PATH,"/")+"',REPLACE(wine_images.image, ' ', '%20' )) AS wine_photo_thumb",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_ORIGINAL_PATH,"/")+"',REPLACE(wine_images.image, ' ', '%20' )) AS wine_photo",
            "CONCAT('"+path.join(constants.IMAGE_PATH.WINE_ORIGINAL_PATH,"/")+"',GET_DEFAULT_WINE_IMAGE(wines_description.type,wines_description.color)) AS default_image",
            "(SELECT GROUP_CONCAT(archive_type) FROM user_archive AS ua2 WHERE customer_id = :customer_id AND ua2.wine_id = :wine_id) AS archive_type"
        ];

        joins += "LEFT OUTER JOIN wines_description ON wines_description.id = wines.wine_description_id " +
            "LEFT OUTER JOIN grapes ON wines_description.grape_id = grapes.id " +
            "LEFT OUTER JOIN countries ON wines_description.country_id = countries.id " +
            "LEFT OUTER JOIN my_notes ON my_notes.wine_id = wines.id AND my_notes.customer_id = :customer_id " +
            "LEFT OUTER JOIN rating_menu ON rating_menu.wine_id = wines.id AND rating_menu.customer_id = :customer_id " +
            "LEFT OUTER JOIN my_wine_photos ON my_wine_photos.wine_id = wines.id AND my_wine_photos.customer_id = :customer_id " +
            "LEFT OUTER JOIN wine_images ON wine_images.wine_id = wines.id AND wine_images.featured_image=1 ";

        if(Utility.isNull(request.body.menu_id)==false && request.body.menu_id > 0){
            columns.push("menu.price");
            joins += "LEFT JOIN menu ON menu.wine_id=wines.id AND menu.id=:menu_id ";
        }else{
            columns.push("wines.price");
        }

        columns.push("wines.score");

        var query = "SELECT " +
                columns.join(", ")+ " " +
            "FROM wines " +
            joins;

        query += "WHERE wines.id=:wine_id ";

        models.sequelize.query(query,{
            replacements:{
                wine_id:request.body.wine_id,
                menu_id:request.body.menu_id,
                customer_id:request.token.customer_id
            },
            type: models.Sequelize.QueryTypes.SELECT
        }).then(function (wineDetails) {
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({wine_details:wineDetails})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();

        });
    }
};