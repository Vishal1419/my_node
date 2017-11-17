/**
 * Created by ravimodha on 27/04/17.
 */

const moment = require('moment');

const VccResponse = require(appRoot+'/common/vcc_response');
const Logger = require(appRoot+'/common/logger');
const Utility = require(appRoot+'/common/utility');
const CsvAnalytics = require(appRoot+'/common/csv_analytics');

const models = require("../models");

const constants = require(global.appRoot+'/common/constants');

module.exports = {
    trackWineWizard:function (request, response) {
        var latitude = Utility.isNull(request.body.latitude)===true?'NULL':request.body.latitude;
        var longitude = Utility.isNull(request.body.longitude)===true?'NULL':request.body.longitude;
        var customerId = request.token.customer_id;
        var restId = request.body.restaurant_id;
        var lower_price =  Utility.isNull(request.body.lower_price)===true?'NULL':request.body.lower_price;
        var upper_price = Utility.isNull(request.body.upper_price)===true?'NULL':request.body.upper_price;
        var style = Utility.isNull(request.body.style)===true?'NULL':"'"+request.body.style+"'";
        var foodCategory = Utility.isNull(request.body.food_category)===true?'NULL':"'"+request.body.food_category+"'";
        var food = Utility.isNull(request.body.food)===true?'NULL':"'"+request.body.food+"'";
        var grape = Utility.isNull(request.body.grape)===true?'NULL':"'"+request.body.grape+"'";


        var columns = [
            "wines.id",
            "wines_description.name AS wine_name",
            "wines_description.producer",
            "wines.vintage",
            "wines_description.type",
            "wines_description.color",
            "wines_description.style",
            "IFNULL("+latitude+",'') AS latitude",
            "IFNULL("+longitude+",'') AS longitude",
            "IFNULL("+lower_price+",'') AS user_sel_lower_price",
            "IFNULL("+upper_price+",'') AS user_sel_upper_price",
            "IFNULL("+style+",'') AS user_sel_style",
            "IFNULL("+foodCategory+",'') AS user_sel_food_category",
            "IFNULL("+food+",'') AS user_sel_food",
            "IFNULL("+grape+",'') AS user_sel_grape",
            customerId + " AS customer_id",
            restId + " AS restaurant_id",
            "'"+moment().utc().format("MM/DD/YYYY HH:mm:ss") + "' AS date_time",
            "'"+Utility.getDeviceTypeFromUserAgent(request)+"' AS application_type"
        ];

        var query = "SELECT " +
                        columns.join(", ")+ " " +
                    "FROM wines " +
                    "INNER JOIN wines_description ON wines.wine_description_id = wines_description.id " +
                    "WHERE wines.id IN (:wine_ids) " +
                    "ORDER BY wines.id ";

        var vccResponse = new VccResponse(response);

        models.sequelize.query(query,{
            replacements:{
                wine_ids:request.body.wine_ids
            },
            type: models.Sequelize.QueryTypes.SELECT,
            raw:true
        }).then(function (wines) {
            CsvAnalytics.sharedInstance().writeToFile(wines,constants.ANALYTIC_TYPES.WINE_WIZARD);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    },
    trackSelectedMapPin:function (request, response) {
        var pinDetails = {};
        var vccResponse = new VccResponse(response);

        pinDetails.restaurant_id = request.body.restaurant_id;
        pinDetails.restaurant_name = request.body.restaurant_name;
        pinDetails.pin_type = request.body.pin_type;
        pinDetails.pin_color = request.body.pin_color;
        pinDetails.latitude = request.body.latitude;
        pinDetails.longitude = request.body.longitude;
        pinDetails.no_of_wines = request.body.no_of_wines;
        pinDetails.customer_id = request.token.customer_id;
        pinDetails.date_time = moment().utc().format("MM/DD/YYYY HH:mm:ss");
        pinDetails.application_type = Utility.getDeviceTypeFromUserAgent(request);

        try{
            CsvAnalytics.sharedInstance().writeToFile(JSON.stringify([pinDetails]),constants.ANALYTIC_TYPES.SELECTED_MAP_PINS);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .send();
        }catch(error){
            Logger.logDbError(error,request);

            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        }
    },
    trackWineArchive:function (request, response) {
        var wineDetails = {};
        var vccResponse = new VccResponse(response);

        wineDetails.id = request.body.wine_id;
        wineDetails.name = request.body.wine_name;
        wineDetails.producer = Utility.isNull(request.body.wine_producer)===true?"":request.body.wine_producer;
        wineDetails.vintage = Utility.isNull(request.body.wine_vintage)===true?"":request.body.wine_vintage;
        wineDetails.style = Utility.isNull(request.body.wine_style)===true?"":request.body.wine_style;
        wineDetails.type = Utility.isNull(request.body.wine_type)===true?"":request.body.wine_type;
        wineDetails.color = Utility.isNull(request.body.wine_color)===true?"":request.body.wine_color;
        wineDetails.archive_type = request.body.archive_type;
        wineDetails.latitude = Utility.isNull(request.body.latitude)===true?"":request.body.latitude;
        wineDetails.longitude = Utility.isNull(request.body.longitude)===true?"":request.body.longitude;
        wineDetails.customer_id = request.token.customer_id;
        wineDetails.date_time = moment().utc().format("MM/DD/YYYY HH:mm:ss");
        wineDetails.application_type = Utility.getDeviceTypeFromUserAgent(request);

        try{
            CsvAnalytics.sharedInstance().writeToFile(JSON.stringify([wineDetails]),constants.ANALYTIC_TYPES.WINE_ARCHIVE);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .send();
        }catch(error){
            Logger.logDbError(error,request);

            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        }
    },
    trackRestaurantArchive:function (request, response) {
        var restaurantDetails = {};
        var vccResponse = new VccResponse(response);

        restaurantDetails.restaurant_id = request.body.restaurant_id;
        restaurantDetails.restaurant_name = request.body.restaurant_name;
        restaurantDetails.latitude = request.body.latitude;
        restaurantDetails.longitude = request.body.longitude;
        restaurantDetails.no_of_wines = request.body.no_of_wines;
        restaurantDetails.place_type = request.body.place_type;
        restaurantDetails.customer_id = request.token.customer_id;
        restaurantDetails.date_time = moment().utc().format("MM/DD/YYYY HH:mm:ss");
        restaurantDetails.application_type = Utility.getDeviceTypeFromUserAgent(request);

        try{
            CsvAnalytics.sharedInstance().writeToFile(JSON.stringify([restaurantDetails]),constants.ANALYTIC_TYPES.RESTAURANT_ARCHIVE);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .send();
        }catch(error){
            Logger.logDbError(error,request);

            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        }
    },
    trackDataFactoryAnalytics:function (request, response) {
        var imageDetails = {};
        var vccResponse = new VccResponse(response);

        imageDetails.submission_type = request.body.submission_type;
        imageDetails.height = request.body.image_height;
        imageDetails.width = request.body.image_width;
        imageDetails.type = request.body.image_type;
        imageDetails.latitude = Utility.isNull(request.body.latitude)===true?"":request.body.latitude;
        imageDetails.longitude = Utility.isNull(request.body.longitude)===true?"":request.body.longitude;
        imageDetails.restaurant_id = Utility.isNull(request.body.restaurant_id)===true?"":request.body.restaurant_id;
        imageDetails.customer_id = request.token.customer_id;
        imageDetails.date_time = moment().utc().format("MM/DD/YYYY HH:mm:ss");
        imageDetails.application_type = Utility.getDeviceTypeFromUserAgent(request);

        try{
            CsvAnalytics.sharedInstance().writeToFile(JSON.stringify([imageDetails]),constants.ANALYTIC_TYPES.DATA_FACTORY);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .send();
        }catch(error){
            Logger.logDbError(error,request);

            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        }

    },

    trackRestaurantList:function (request, response) {
        var restaurantDetails = request.body.restaurant_list;
        var vccResponse = new VccResponse(response);

        restaurantDetails.forEach(function (restaurant) {
            restaurant.customer_id = request.token.customer_id;
            restaurant.date_time = moment().utc().format("MM/DD/YYYY HH:mm:ss");
            restaurant.application_type = Utility.getDeviceTypeFromUserAgent(request);
        });

        try{
            CsvAnalytics.sharedInstance().writeToFile(restaurantDetails,constants.ANALYTIC_TYPES.RESTAURANT_LIST);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .send();
        }catch(error){
            Logger.logDbError(error,request);

            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        }
    },

    trackFoodWinePairing:function (request,response) {
        var vccResponse = new VccResponse(response);

        var notificationOpenDateTime = moment.utc(moment.unix(request.body.notification_open_datetime)).format("MM/DD/YYYY HH:mm:ss");
        var submittedDateTime = moment.utc(moment.unix(request.body.submitted_datetime)).format("MM/DD/YYYY HH:mm:ss");
        var restaurantId = request.body.restaurant_id;
        var restaurantName = request.body.restaurant_name;
        var wineId = request.body.wine_id;
        var wineName = request.body.wine_name;
        var wineRating = request.body.wine_rate;
        var foodCategory = Utility.isNull(request.body.food_category)===true?"":request.body.food_category;
        var foodName = Utility.isNull(request.body.food_name)===true?"":request.body.food_name;
        var foodWineRating = Utility.isNull(request.body.food_wine_rate)===true?"":request.body.food_wine_rate;

        var foodWinePairingDetails = {
            restaurant_id:restaurantId,
            restaurant_name:restaurantName,
            wine_id:wineId,
            wine_name:wineName,
            wine_rate:wineRating,
            food_category:foodCategory,
            food_name:foodName,
            food_rate:foodWineRating,
            notification_open_datetime:notificationOpenDateTime,
            submitted_datetime:submittedDateTime,
            customer_id:request.token.customer_id,
            date_time:moment().utc().format("MM/DD/YYYY HH:mm:ss"),
            application_type:Utility.getDeviceTypeFromUserAgent(request)
        };

        try{
            CsvAnalytics.sharedInstance().writeToFile(JSON.stringify([foodWinePairingDetails]),constants.ANALYTIC_TYPES.FOOD_WINE_PAIRING);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .send();
        }catch(error){
            Logger.logDbError(error,request);

            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        }
    }
};