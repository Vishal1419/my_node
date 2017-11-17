/**
 * Created by ravimodha on 20/08/16.
 */

const moment = require('moment');
const validate = require("validate.js");
const path = require('path');

const models = require("../models");

const VccResponse = require(appRoot+'/common/vcc_response');
const Utility = require(appRoot+'/common/utility');
const Logger = require(appRoot+'/common/logger');
const constants = require(appRoot+'/common/constants');
const vincompassController = require('../controllers/vincompass_controller');
const async = require("async");

module.exports = {
    getList: function (request, response) {
        async.waterfall([
            function (callback) {
                models.RadiusConfig
                    .findOne({
                        where:{
                            config_type:constants.SOURCE_TYPE.MOBILE
                        }
                    })
                    .then(function (radiusConfig) {
                        if(radiusConfig){
                            callback(null,radiusConfig.radius,radiusConfig.record_limit);
                        }else{
                            callback(null,constants.RADIUS_DEFAULTS.RADIUS,constants.RADIUS_DEFAULTS.RECORD_LIMIT);
                        }
                    })
                    .catch(function (error) {
                        Logger.logDbError(error,request);
                        callback(null,constants.RADIUS_DEFAULTS.RADIUS,constants.RADIUS_DEFAULTS.RECORD_LIMIT);
                    });
            },
            function (radius,recordLimit,callback) {
                var columns = [
                    "restaurants.id as restaurant_id",
                    "restaurants.name",
                    "restaurants.latitude",
                    "restaurants.longitude",
                    "( 3959 * acos( cos( radians(:latitude) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(:longitude) ) + sin( radians(:latitude) ) * sin( radians( latitude ) ) ) ) AS distance",
                    "restaurants.address",
                    "(CASE WHEN restaurants.cuisine IS NULL or restaurants.cuisine = '' THEN 'N/A' ELSE restaurants.cuisine END) AS cuisine ",
                    "restaurants.city",
                    "restaurants.phone",
                    "CONCAT('"+path.join(constants.IMAGE_PATH.RESTAURANT_ORIGINAL_PATH)+"','/',REPLACE(restaurant_images.image, ' ', '%20' )) AS image",
                    "CONCAT('"+path.join(constants.IMAGE_PATH.RESTAURANT_THUMB_PATH)+"','/',REPLACE(restaurant_images.image, ' ', '%20' )) AS image_thumb",
                    "restaurants.wine_count",
                    "GROUP_CONCAT(user_place_type) AS place_type "
                ];

                var query = "SELECT " +
                    columns.join(", ")+ " " +
                    "FROM restaurants " +
                    "LEFT OUTER JOIN restaurant_images ON restaurants.id = restaurant_images.restaurant_id AND restaurant_images.featured_image=1 " +
                    "LEFT JOIN user_places ON restaurants.id = user_places.restaurant_id && customer_id=:customer_id && (user_place_type=:remember_type OR user_place_type=:favorite_type) " +
                    "GROUP BY restaurants.id " +
                    "HAVING distance<=:radius OR distance IS NULL " +
                    "ORDER BY distance " +
                    "LIMIT :record_limit";


                models.sequelize.query(query,
                    {
                        replacements:{
                            latitude:request.body.latitude,
                            longitude:request.body.longitude,
                            radius:radius,
                            record_limit:recordLimit,
                            customer_id:request.token.customer_id,
                            remember_type:constants.USER_ARCHIVE_TYPE.MY_REMEMBER,
                            favorite_type:constants.USER_ARCHIVE_TYPE.MY_FAVORITE
                        },
                        type: models.Sequelize.QueryTypes.SELECT
                    }
                ).then(function (restaurantList) {
                    models.MySearchHistory.create({
                        search: "",
                        address: "",
                        radius: 0,
                        mockup: 0,
                        web_restaurant_name: "",
                        web_wine_name: "",
                        web_city: "",
                        web_state: "",
                        web_zip_code: "",
                        web_address: "",
                        customer_id: request.token.customer_id,
                        latitude: request.body.latitude,
                        longitude: request.body.longitude,
                        num_rows: restaurantList.length,
                        device: Utility.getDeviceTypeFromUserAgent(request),
                        add_date: moment().utc()
                    }).then(function (mySearchHistory) {
                        callback(null,{restaurants:restaurantList,search_id:mySearchHistory.id})
                    });
                }).catch(function (error) {

                });
            }
        ],function (error, result) {
            var vccResponse = new VccResponse(response);

            if(error){
                Logger.logDbError(error,request);

                vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                    .send();
            }else{
                // vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                //     .setResponseBody({restaurants: result, search_id: mySearchHistory.id})
                //     .send();

                vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                    .setResponseBody(result)
                    .send();
            }
        });
    },

    checkIn: function (request, response) {
        var self = this;

        models.CustomerCheckIn.create(
            {
                customer_id: request.token.customer_id,
                restaurant_id: request.body.restaurant_id,
                order: 0,
                latitude: request.body.latitude,
                longitude: request.body.longitude,
                search_id: request.body.search_id,
                check_in_time: moment().utc(),
                device: Utility.getDeviceTypeFromUserAgent(request)
            }
        ).then(function (checkIn) {
            self.addToMyPlaces(request,function (error) {
                var vccResponse;

                if(error){
                    vccResponse = new VccResponse(response);
                    vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                        .send();
                }else{
                    vccResponse = new VccResponse(response);
                    vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                        .send();
                }
            })
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    },

    addToMyPlaces:function (request, callback) {
        var addDate = moment.utc();
        var addPlaceCallBack = function () {
            vincompassController.addGamificationPoint(constants.GAMIFICATION_EVENT_TYPE.RESTAURANT_ARCHIVE,[request.body.restaurant_id],request.token.customer_id,request,function () {
                models.UserPlacesHistory.create({
                    customer_id: request.token.customer_id,
                    restaurant_id: request.body.restaurant_id,
                    add_date: addDate,
                    user_place_type:constants.USER_ARCHIVE_TYPE.MY_PLACE
                }).then(function (userPlaceHistory) {
                    callback();
                }).catch(function (error) {
                    Logger.logDbError(error,request);
                    callback();
                });
            });
        };

        models.UserPlaces.findOrCreate(
            {
                where: {
                    customer_id: request.token.customer_id,
                    restaurant_id: request.body.restaurant_id,
                    user_place_type:constants.USER_ARCHIVE_TYPE.MY_PLACE
                },
                defaults: {
                    customer_id: request.token.customer_id,
                    restaurant_id: request.body.restaurant_id,
                    add_date: addDate,
                    user_place_type:constants.USER_ARCHIVE_TYPE.MY_PLACE
                }
            }
        ).spread(function (myplace, created) {
            if(!created){
                myplace.update(
                    {
                        add_date: addDate
                    },
                    {
                        fields:[
                            "add_date"
                        ]
                    }
                ).then(function () {
                    addPlaceCallBack();
                }).catch(function (error) {
                    Logger.logDbError(error,request);
                    callback(error);
                });
            }else{
                addPlaceCallBack();
            }
        }).catch(function (error) {
            Logger.logDbError(error,request);
            callback(error);
        });
    },

    getCuisine:function (request, response) {
        models.Restaurants.findAll({
            attributes:[
                [models.Sequelize.literal('DISTINCT cuisine'), 'cuisine']
            ],
            where:{
                cuisine:{
                    $not:''
                }
            },
            raw:true
        }).then(function (cuisines) {
            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({cuisine: cuisines})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    },

    getFavList:function (request, response) {
        var joins = "";
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
            "restaurants.id as restaurant_id",
            "restaurants.name",
            "restaurants.address",
            "restaurants.phone",
            "restaurants.wine_count",
            "CONCAT('"+path.join(constants.IMAGE_PATH.RESTAURANT_THUMB_PATH)+"','/',REPLACE(restaurant_images.image, ' ', '%20' )) AS image_thumb",
            "CONCAT('"+path.join(constants.IMAGE_PATH.RESTAURANT_ORIGINAL_PATH)+"','/',REPLACE(restaurant_images.image, ' ', '%20' )) AS image",
            "restaurants.city",
            "restaurants.state_prov",
            "restaurants.zip",
            "restaurants.country",
            "user_places.add_date"
        ];

        if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.MOBILE){
            columns.push("restaurants.position");
            columns.push("(CASE WHEN restaurants.cuisine IS NULL or restaurants.cuisine = '' THEN 'N/A' ELSE restaurants.cuisine END) AS cuisine ");
            columns.push("TRUE AS is_favorite");
        }

        joins += "INNER JOIN restaurants ON user_places.restaurant_id = restaurants.id AND restaurants.active = :active AND is_deleted = :is_deleted " +
            "LEFT OUTER JOIN restaurant_images ON restaurants.id = restaurant_images.restaurant_id AND restaurant_images.featured_image=1  ";


        if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.WEB){
            joins += "LEFT OUTER JOIN ws_restaurants ON ws_restaurants.id = restaurants.winespectator_id ";

            columns.push("ws_restaurants.winespectator_award")
        }

        var query = "SELECT " +
                columns.join(", ")+ " " +
            "FROM user_places " +
            joins;

        query += "WHERE user_places.customer_id = :customer_id AND user_places.user_place_type = :user_archive_type " +
            "ORDER BY add_date DESC ";



        if(pageNo > 0 && noOfRecords > 0){
            startIndex = (pageNo - 1) * noOfRecords;
            query += "LIMIT :start_index, :offset";
        }

        models.sequelize.query(query,
            {
                replacements:{
                    customer_id:request.token.customer_id,
                    user_archive_type:constants.USER_ARCHIVE_TYPE.MY_FAVORITE,
                    active:1,
                    is_deleted:0,
                    start_index:startIndex,
                    offset:parseInt(noOfRecords) + 1
                },
                type: models.Sequelize.QueryTypes.SELECT
            }
        ).then(function (favRestaurants) {
            var nextPage = false;

            if(pageNo > 0 && noOfRecords > 0){
                if(favRestaurants.length == (parseInt(noOfRecords) + 1)){
                    nextPage = true;
                    favRestaurants.pop();
                }
            }

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({restaurants: favRestaurants,next_page:nextPage})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    },

    getMyPlaces:function (request, response) {
        var pageNo = 0;
        var noOfRecords = 0;
        var startIndex = 0;
        var joins="";

        if(Utility.isNull(request.params.page_no) == false){
            pageNo = request.params.page_no;
        }

        if(Utility.isNull(request.params.no_of_records) == false){
            noOfRecords = request.params.no_of_records;
        }

        var columns = [
            "restaurants.id as restaurant_id",
            "restaurants.name",
            "restaurants.latitude",
            "restaurants.longitude",
            "restaurants.address",
            "restaurants.phone",
            "restaurants.wine_count",
            "CONCAT('"+path.join(constants.IMAGE_PATH.RESTAURANT_THUMB_PATH)+"','/',REPLACE(restaurant_images.image, ' ', '%20' )) AS image_thumb",
            "CONCAT('"+path.join(constants.IMAGE_PATH.RESTAURANT_ORIGINAL_PATH)+"','/',REPLACE(restaurant_images.image, ' ', '%20' )) AS image",
            "restaurants.city",
            "restaurants.state_prov",
            "restaurants.zip",
            "restaurants.country",
            "up1.add_date",
            "(CASE WHEN EXISTS (SELECT * FROM user_places AS up2 WHERE customer_id = :customer_id AND user_place_type = :favorite_value AND up2.restaurant_id = up1.restaurant_id) THEN true ELSE false END) AS is_favorite"
        ];

        if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.MOBILE){
            columns.push("restaurants.position");
            columns.push("(CASE WHEN restaurants.cuisine IS NULL or restaurants.cuisine = '' THEN 'N/A' ELSE restaurants.cuisine END) AS cuisine ");
        }

        joins += "INNER JOIN restaurants ON up1.restaurant_id = restaurants.id AND restaurants.active = :active AND is_deleted = :is_deleted " +
            "LEFT OUTER JOIN restaurant_images ON restaurants.id = restaurant_images.restaurant_id AND restaurant_images.featured_image=1 ";


        if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.WEB){
            joins += "LEFT OUTER JOIN ws_restaurants ON ws_restaurants.id = restaurants.winespectator_id ";

            columns.push("ws_restaurants.winespectator_award");
        }

        var query = "SELECT " +
                columns.join(", ")+ " " +
            "FROM user_places AS up1 " +
            joins +
            "WHERE up1.customer_id = :customer_id AND up1.user_place_type = :user_archive_type " +
            "ORDER BY add_date DESC ";

        if(pageNo > 0 && noOfRecords > 0){
            startIndex = (pageNo - 1) * noOfRecords;
            query += "LIMIT :start_index, :offset";
        }

        models.sequelize.query(query,
            {
                replacements:{
                    customer_id:request.token.customer_id,
                    user_archive_type:constants.USER_ARCHIVE_TYPE.MY_PLACE,
                    favorite_value:constants.USER_ARCHIVE_TYPE.MY_FAVORITE,
                    active:1,
                    is_deleted:0,
                    start_index:startIndex,
                    offset:parseInt(noOfRecords) + 1
                },
                type: models.Sequelize.QueryTypes.SELECT
            }
        ).then(function (myPlaceList) {
            var nextPage = false;

            if(pageNo > 0 && noOfRecords > 0){
                if(myPlaceList.length == (parseInt(noOfRecords) + 1)){
                    nextPage = true;
                    myPlaceList.pop();
                }
            }

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({restaurants: myPlaceList,next_page:nextPage})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    },

    search:function (request, response, searchForFavorite) {
        var searchBlock = function (latitude,longitude,radius,recordLimit) {
            var whereCondition = "restaurants.active = :active AND restaurants.is_deleted = :is_deleted AND ";
            var subQueryJoins = "";
            var outerQueryJoins = "";
            var columns = [
                "restaurants.id",
                "restaurants.name",
                "restaurants.latitude",
                "restaurants.longitude",
                "( 3959 * acos( cos( radians("+latitude+") ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians("+longitude+") ) + sin( radians("+latitude+") ) * sin( radians( latitude ) ) ) ) AS distance",
                "restaurants.address",
                "restaurants.city",
                "restaurants.state_prov",
                "restaurants.zip",
                "restaurants.country",
                "restaurants.phone",
                "restaurants.wine_count",
                "restaurants.winespectator_id",
                "CONCAT('"+path.join(constants.IMAGE_PATH.RESTAURANT_THUMB_PATH)+"','/',REPLACE(restaurant_images.image, ' ', '%20' )) AS image_thumb",
                "CONCAT('"+path.join(constants.IMAGE_PATH.RESTAURANT_ORIGINAL_PATH)+"','/',REPLACE(restaurant_images.image, ' ', '%20' )) AS image"
            ];

            subQueryJoins += "LEFT OUTER JOIN restaurant_images ON restaurants.id = restaurant_images.restaurant_id AND restaurant_images.featured_image=1 ";

            if(validate.isEmpty(request.body.is_favorite) == false && (request.body.is_favorite == true || request.body.is_favorite == 'true')){
                var userArchiveJoin = "";

                outerQueryJoins += "LEFT OUTER JOIN menu ON restaurants.id = menu.restaurant_id ";
                outerQueryJoins += "INNER JOIN user_archive ON menu.wine_id = user_archive.wine_id AND user_archive.customer_id = :customer_id AND user_archive.archive_type = :user_archive_type ";

            }else{
                if(validate.isEmpty(request.body.wine_color) == false ||
                    validate.isEmpty(request.body.wine_country) == false ||
                    validate.isEmpty(request.body.wine_name) == false ||
                    validate.isEmpty(request.body.wine_min_price) == false ||
                    validate.isEmpty(request.body.wine_max_price) == false){
                    outerQueryJoins = "INNER JOIN menu ON restaurants.id = menu.restaurant_id AND menu.active=1 ";

                    if(validate.isEmpty(request.body.wine_min_price) == false &&
                        validate.isEmpty(request.body.wine_max_price) == false){
                        outerQueryJoins += "AND menu.price BETWEEN :min_price AND :max_price ";
                    }

                    if(validate.isEmpty(request.body.wine_color) == false ||
                        validate.isEmpty(request.body.wine_country) == false ||
                        validate.isEmpty(request.body.wine_name) == false){
                        var wineDescriptionJoin = "";

                        outerQueryJoins += "INNER JOIN wines ON menu.wine_id = wines.id ";

                        wineDescriptionJoin = "INNER JOIN wines_description ON wines.wine_description_id = wines_description.id ";

                        if(validate.isEmpty(request.body.wine_name) == false){
                            wineDescriptionJoin = wineDescriptionJoin + " AND wines_description.name LIKE :wine_name ";
                        }

                        if(validate.isEmpty(request.body.wine_country) == false){
                            wineDescriptionJoin = wineDescriptionJoin + " AND wines_description.country = :country ";
                        }

                        if(validate.isEmpty(wineDescriptionJoin) == false){
                            outerQueryJoins += wineDescriptionJoin;
                        }
                    }
                }
            }

            outerQueryJoins += "LEFT OUTER JOIN user_places ON restaurants.id = user_places.restaurant_id AND user_place_type = :user_archive_type AND user_places.customer_id = :customer_id ";

            if(validate.isEmpty(request.body.cuisine) == false){
                whereCondition = "cuisine LIKE :cuisine AND ";
            }

            if(validate.isEmpty(request.body.name) == false){
                whereCondition = whereCondition + "restaurants.name LIKE :name AND ";
            }

            if(validate.isEmpty(whereCondition) == false){
                whereCondition = "WHERE "+whereCondition.substr(0,whereCondition.length - 4);
            }

            var innerQuery = "SELECT " +
                    "restaurants.*, " +
                    "IF(ISNULL(user_places.id),false,true) AS is_favorite " +
                "FROM (" +
                    "SELECT " +
                        columns.join(", ")+ " " +
                    "FROM restaurants " +
                    subQueryJoins +
                    whereCondition +
                    "HAVING distance <= :radius OR distance IS NULL " +
                ") AS restaurants ";

            innerQuery += outerQueryJoins + "GROUP BY restaurants.id ";

            if(searchForFavorite){
                innerQuery += "HAVING is_favorite IS NOT true ";
            }

            innerQuery += "LIMIT :record_limit ";

            var mainQuery = "SELECT " +
                    "restaurants.*, " +
                    "ws_restaurants.winespectator_award  " +
                "FROM (" +
                    innerQuery +
                ") AS restaurants " +
                "LEFT OUTER JOIN ws_restaurants ON ws_restaurants.id = restaurants.winespectator_id " +
                "ORDER BY restaurants.wine_count DESC ";

            models.sequelize.query(mainQuery,{
                replacements:{
                    radius:radius,
                    record_limit:recordLimit,
                    customer_id:request.token.customer_id,
                    name:request.body.name,
                    user_archive_type:constants.USER_ARCHIVE_TYPE.MY_FAVORITE,
                    wine_name:"%"+request.body.wine_name+"%",
                    cuisine:"%"+request.body.cuisine+"%",
                    country:request.body.wine_country,
                    min_price:request.body.wine_min_price,
                    max_price:request.body.wine_max_price,
                    active:1,
                    is_deleted:0
                },
                type: models.Sequelize.QueryTypes.SELECT
            }).then(function (restaurants) {
                var vccResponse = new VccResponse(response);
                vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                    .setResponseBody({restaurants: restaurants})
                    .send();
            }).catch(function (error) {
                Logger.logDbError(error,request);

                var vccResponse = new VccResponse(response);
                vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                    .send();
            });
        };

        models.RadiusConfig
            .findOne({
                where:{
                    config_type:constants.SOURCE_TYPE.WEB
                }
            })
            .then(function (radiusConfig) {
                if(radiusConfig){
                    searchBlock(request.body.latitude,request.body.longitude,radiusConfig.radius,radiusConfig.record_limit);
                }else{
                    searchBlock(request.body.latitude,request.body.longitude,constants.RADIUS_DEFAULTS.RADIUS,constants.RADIUS_DEFAULTS.RECORD_LIMIT);
                }
            })
            .catch(function (error) {
                Logger.logDbError(error,request);
                searchBlock(request.body.latitude,request.body.longitude,constants.RADIUS_DEFAULTS.RADIUS,constants.RADIUS_DEFAULTS.RECORD_LIMIT);
            });
    },

    searchToAddFavorite:function (request, response) {
        var whereCondition = "restaurants.active = :active AND restaurants.is_deleted = :is_deleted AND ";
        var subQueryJoins = "";
        var outerQueryJoins = "";
        var columns = [
            "restaurants.id as restaurant_id",
            "restaurants.name",
            "restaurants.latitude",
            "restaurants.longitude",
            "restaurants.address",
            "restaurants.phone",
            "restaurants.wine_count",
            "CONCAT('"+path.join(constants.IMAGE_PATH.RESTAURANT_THUMB_PATH)+"','/',REPLACE(restaurant_images.image, ' ', '%20' )) AS image_thumb",
            "CONCAT('"+path.join(constants.IMAGE_PATH.RESTAURANT_ORIGINAL_PATH)+"','/',REPLACE(restaurant_images.image, ' ', '%20' )) AS image",
            "restaurants.city",
            "restaurants.state_prov",
            "restaurants.zip",
            "restaurants.country"
        ];

        if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.MOBILE){
            columns.push("restaurants.position");
            columns.push("(CASE WHEN restaurants.cuisine IS NULL or restaurants.cuisine = '' THEN 'N/A' ELSE restaurants.cuisine END) AS cuisine ");
        }

        subQueryJoins += "LEFT OUTER JOIN restaurant_images ON restaurants.id = restaurant_images.restaurant_id AND restaurant_images.featured_image=1 ";

        outerQueryJoins += "LEFT OUTER JOIN user_places ON restaurants.restaurant_id = user_places.restaurant_id AND user_place_type = :user_archive_type AND user_places.customer_id = :customer_id ";

        if(validate.isEmpty(request.body.cuisine) == false){
            whereCondition = "cuisine LIKE :cuisine AND ";
        }

        if(validate.isEmpty(request.body.name) == false){
            whereCondition = whereCondition + "restaurants.name LIKE :name AND ";
        }

        if(validate.isEmpty(request.body.city) == false){
            whereCondition = whereCondition + "restaurants.city LIKE :city AND ";
        }

        if(validate.isEmpty(request.body.address) == false){
            whereCondition = whereCondition + "restaurants.address LIKE :address AND ";
        }

        if(validate.isEmpty(whereCondition) == false){
            whereCondition = "WHERE "+whereCondition.substr(0,whereCondition.length - 4);
        }

        var innerQuery = "SELECT " +
                "restaurants.*, " +
                "IF(ISNULL(user_places.id),false,true) AS is_favorite " +
            "FROM (" +
                    "SELECT " +
                        columns.join(", ")+ " " +
                    "FROM restaurants " +
                    subQueryJoins +
                    whereCondition +
            ") AS restaurants ";

        innerQuery += outerQueryJoins + "GROUP BY restaurants.restaurant_id ";

        innerQuery +="ORDER BY restaurants.wine_count DESC ";
        innerQuery += "LIMIT 50 ";

        models.sequelize.query(innerQuery,{
            replacements:{
                customer_id:request.token.customer_id,
                user_archive_type:constants.USER_ARCHIVE_TYPE.MY_FAVORITE,
                name:"%"+request.body.name+"%",
                city:"%"+request.body.city+"%",
                address:"%"+request.body.address+"%",
                cuisine:"%"+request.body.cuisine+"%",
                active:1,
                is_deleted:0
            },
            type: models.Sequelize.QueryTypes.SELECT
        }).then(function (restaurants) {
            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({restaurants: restaurants})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    },

    getDetail:function (request, response) {
        var columns = [
            "restaurants.id as restaurant_id",
            "restaurants.name",
            "restaurants.address",
            "restaurants.phone",
            "restaurants.wine_count",
            "CONCAT('"+path.join(constants.IMAGE_PATH.RESTAURANT_THUMB_PATH)+"','/',REPLACE(restaurant_images.image, ' ', '%20' )) AS image_thumb",
            "CONCAT('"+path.join(constants.IMAGE_PATH.RESTAURANT_ORIGINAL_PATH)+"','/',REPLACE(restaurant_images.image, ' ', '%20' )) AS image",
            "restaurants.city",
            "restaurants.state_prov",
            "restaurants.zip",
            "restaurants.country",
            "restaurants.latitude",
            "restaurants.longitude"
        ];

        if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.MOBILE){
            columns.push("(CASE WHEN restaurants.cuisine IS NULL or restaurants.cuisine = '' THEN 'N/A' ELSE restaurants.cuisine END) AS cuisine ");

        }else{
            columns.push("up1.add_date");
            columns.push("restaurants.website");
            columns.push("GROUP_CONCAT(up1.user_place_type) AS place_type");
            columns.push("ws_restaurants.winespectator_award");
        }

        var query = "SELECT " +
                columns.join(", ")+ " " +
            "FROM restaurants ";

        query += "LEFT OUTER JOIN restaurant_images ON restaurants.id = restaurant_images.restaurant_id AND restaurant_images.featured_image = 1 ";

        if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.WEB){
            query += "LEFT OUTER JOIN ws_restaurants ON ws_restaurants.id = restaurants.winespectator_id ";
            query += "LEFT OUTER JOIN user_places AS up1 ON restaurants.id = up1.restaurant_id AND (up1.user_place_type = :remember_value OR up1.user_place_type = :favorite_value) AND up1.customer_id = :customer_id ";
            query += "WHERE restaurants.id = :restaurant_id AND restaurants.active = :active AND restaurants.is_deleted = :is_deleted ";
            query += "GROUP BY restaurants.id ";
            query += "ORDER BY up1.add_date";
        }else{
            query += "WHERE restaurants.id = :restaurant_id AND restaurants.active = :active AND restaurants.is_deleted = :is_deleted ";
        }

        models.sequelize.query(query,
            {
                replacements:{
                    customer_id:request.token.customer_id,
                    restaurant_id:request.params.restaurant_id,
                    favorite_value:constants.USER_ARCHIVE_TYPE.MY_FAVORITE,
                    remember_value:constants.USER_ARCHIVE_TYPE.MY_REMEMBER,
                    active:1,
                    is_deleted:0
                },
                type: models.Sequelize.QueryTypes.SELECT
            }
        ).then(function (restaurantDetail) {
            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({
                    detail: (restaurantDetail.length > 0)?restaurantDetail[0]:{}
                })
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    },

    getRestaurantLookUp:function (request, response) {
        var whereCondition = "WHERE name LIKE :restaurant_name";

        // if(Utility.isNull(request.body.city_area) == false &&
        //     validate.isEmpty(request.body.city_area) == false){
        //     whereCondition = whereCondition + " AND city_area=:city_area";
        // }

        if(Utility.isNull(request.body.city) == false &&
            validate.isEmpty(request.body.city) == false){
            whereCondition = whereCondition + " AND city=:city";
        }

        if(Utility.isNull(request.body.cuisine) == false &&
            validate.isEmpty(request.body.cuisine) == false){
            whereCondition = whereCondition + " AND cuisine LIKE :cuisine";
        }

        models.sequelize.query("SELECT " +
                "name " +
            "FROM restaurants " +
            whereCondition,
            {
                replacements:{
                    restaurant_name:"%"+request.body.search_string+"%",
                    city_area:request.body.city_area,
                    city:request.body.city,
                    cuisine:"%"+request.body.cuisine+"%"
                },
                type:models.Sequelize.QueryTypes.SELECT
            }
        ).then(function (restaurantList) {
            var hasLookAheadFailed = false;
            var keepTypingFlag = false;
            var searchCount = restaurantList.length;

            if(searchCount <= 10){
                hasLookAheadFailed = false;
                keepTypingFlag = false;
            }else if(searchCount > 10){
                hasLookAheadFailed = false;
                keepTypingFlag = true;
            }else{
                hasLookAheadFailed = true;
                keepTypingFlag = false;
            }


            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({
                    search_count:searchCount,
                    has_look_ahead_failed:hasLookAheadFailed,
                    keep_typing_flag:keepTypingFlag,
                    restaurants: restaurantList})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });


    },

    addToFavorite:function (request, response) {
        models.Restaurants.count({
            where:{
                id:request.body.restaurant_id
            }
        }).then(function (count) {
            var vccResponse = new VccResponse(response);
            var addDate = moment.utc();

            if(count>0){
                var callback = function () {
                    models.UserPlacesHistory.create({
                        customer_id: request.token.customer_id,
                        restaurant_id: request.body.restaurant_id,
                        add_date: addDate,
                        user_place_type:constants.USER_ARCHIVE_TYPE.MY_FAVORITE
                    }).then(function (userPlaceHistory) {
                        var vccResponse = new VccResponse(response);
                        vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                            .send();
                    }).catch(function (error) {
                        Logger.logDbError(error,request);

                        var vccResponse = new VccResponse(response);
                        vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                            .send();
                    });
                };

                models.UserPlaces.findOrCreate(
                    {
                        where: {
                            customer_id: request.token.customer_id,
                            restaurant_id: request.body.restaurant_id,
                            user_place_type:constants.USER_ARCHIVE_TYPE.MY_FAVORITE
                        },
                        defaults: {
                            customer_id: request.token.customer_id,
                            restaurant_id: request.body.restaurant_id,
                            add_date: addDate,
                            user_place_type:constants.USER_ARCHIVE_TYPE.MY_FAVORITE
                        }
                    }
                ).spread(function (myplace, created) {
                    if(!created){
                        myplace.update(
                            {
                                add_date: addDate
                            },
                            {
                                fields:[
                                    "add_date"
                                ]
                            }
                        ).then(function () {
                            callback();
                        });
                    }else{
                        vincompassController.addGamificationPoint(constants.GAMIFICATION_EVENT_TYPE.FAVORITE_RESTAURANT,[request.body.restaurant_id],request.token.customer_id,request,function () {
                            callback();
                        });
                    }
                }).catch(function (error) {
                    Logger.logDbError(error,request);

                    var vccResponse = new VccResponse(response);
                    vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                        .send();
                });
            }else{
                vccResponse.setStatusCode(VccResponse.RECORD_NOT_EXIST)
                    .setResponseBody({error: constants.ERROR_MESSAGES.RESTAURANT_NOT_FOUND})
                    .send();
            }
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    },

    removeFromFavorite:function (request, response) {
        var vccResponse = new VccResponse(response);

        models.Restaurants.count({
            where:{
                id:request.params.restaurant_id
            }
        }).then(function (count){
            if(count>0){
                models.UserPlaces.destroy({
                  where:{
                      customer_id:request.token.customer_id,
                      restaurant_id:request.params.restaurant_id,
                      user_place_type:constants.USER_ARCHIVE_TYPE.MY_FAVORITE
                  }
                }).then(function (deletedCount) {
                    if(deletedCount>0){
                        vincompassController.deleteGamificationPoint(constants.GAMIFICATION_EVENT_TYPE.FAVORITE_RESTAURANT,[request.params.restaurant_id],request,function () {
                            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                                .send();
                        });
                    }else{
                        vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                            .send();
                    }

                }).catch(function (error) {
                    Logger.logDbError(error,request);

                    vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                        .send();
                });
            }else{
                vccResponse.setStatusCode(VccResponse.RECORD_NOT_EXIST)
                    .setResponseBody({error: constants.ERROR_MESSAGES.RESTAURANT_NOT_FOUND})
                    .send();
            }
        }).catch(function (error) {
            Logger.logDbError(error,request);

            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    },

    addToMyRemember:function (request, response) {
        models.Restaurants.count({
            where:{
                id:request.body.restaurant_id
            }
        }).then(function (count) {
            var vccResponse = new VccResponse(response);

            if(count>0){
                var addDate = moment.utc();

                var callback = function () {
                    models.UserPlacesHistory.create({
                        customer_id: request.token.customer_id,
                        restaurant_id: request.body.restaurant_id,
                        add_date: addDate,
                        user_place_type:constants.USER_ARCHIVE_TYPE.MY_REMEMBER
                    }).then(function (userPlaceHistory) {
                        var vccResponse = new VccResponse(response);
                        vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                            .send();
                    }).catch(function (error) {
                        Logger.logDbError(error,request);

                        var vccResponse = new VccResponse(response);
                        vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                            .send();
                    });
                };

                models.UserPlaces.findOrCreate(
                    {
                        where: {
                            customer_id: request.token.customer_id,
                            restaurant_id: request.body.restaurant_id,
                            user_place_type:constants.USER_ARCHIVE_TYPE.MY_REMEMBER
                        },
                        defaults: {
                            customer_id: request.token.customer_id,
                            restaurant_id: request.body.restaurant_id,
                            add_date: addDate,
                            user_place_type:constants.USER_ARCHIVE_TYPE.MY_REMEMBER
                        }
                    }
                ).spread(function (myRememberedPlace, created) {
                    if(!created){
                        myRememberedPlace.update(
                            {
                                add_date: addDate
                            },
                            {
                                fields:[
                                    "add_date"
                                ]
                            }
                        ).then(function () {
                            callback();
                        });
                    }else{
                        callback();
                    }
                }).catch(function (error) {
                    Logger.logDbError(error,request);

                    var vccResponse = new VccResponse(response);
                    vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                        .send();
                });
            }else{
                vccResponse.setStatusCode(VccResponse.RECORD_NOT_EXIST)
                    .setResponseBody({error: constants.ERROR_MESSAGES.RESTAURANT_NOT_FOUND})
                    .send();
            }
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    },

    neighborhoodLookUp:function (request, response) {
        var searchString = request.body.search_str;
        var searchStringArray = searchString.split(",");

        var neighborhoodSearchStr = "(";
        var citySearchStr = "(";
        var stateSearchStr = "(";
        var querySearchStr = "";

        for (var i=0; i<searchStringArray.length; i++){
            neighborhoodSearchStr = neighborhoodSearchStr + "neighborhood LIKE '%"+(searchStringArray[i]).trim()+"%' OR ";
            citySearchStr = citySearchStr + "city LIKE '%"+(searchStringArray[i]).trim()+"%' OR ";
            stateSearchStr = stateSearchStr + "state LIKE '%"+(searchStringArray[i]).trim()+"%' OR ";
        }

        neighborhoodSearchStr = neighborhoodSearchStr.substring( 0, neighborhoodSearchStr.length - 4) + ")";
        citySearchStr = citySearchStr.substring( 0, citySearchStr.length - 4) + ")";
        stateSearchStr = stateSearchStr.substring( 0, stateSearchStr.length - 4) + ")";

        querySearchStr = neighborhoodSearchStr + " OR " + citySearchStr + " OR " + stateSearchStr;

        models.sequelize.query("SELECT " +
                "id AS neighborhood_id, " +
                "ncsm.neighborhood, " +
                "ncsm.city, " +
                "ncsm.state, " +
                "ncsm.country, " +
                "ncsm.latitude, " +
                "ncsm.longitude " +
            "FROM neighborhood_city_state_maps AS ncsm " +
            "WHERE "+querySearchStr,
            {
                type: models.Sequelize.QueryTypes.SELECT
            }

        ).then(function (neighborhoodList) {
            console.log(neighborhoodList.length);

            var vccResponse = new VccResponse(response);

            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({neighborhoodLookUp: neighborhoodList})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    },

    removePlace:function (request, response) {
        var where;

        if(request.body.place_type == constants.ALL){
            where = {
                restaurant_id:{
                    $in:request.body.restaurant_ids
                },
                customer_id:request.token.customer_id
            };
        }else{
            where = {
                restaurant_id:{
                    $in:request.body.restaurant_ids
                },
                customer_id:request.token.customer_id,
                user_place_type:request.body.place_type
            };
        }

        models.UserPlaces.destroy({
            where:where
        }).then(function (deletedCount) {
            var vccResponse = new VccResponse(response);

            if(deletedCount>0){
                if(request.body.place_type == constants.USER_ARCHIVE_TYPE.MY_PLACE){
                    vincompassController.deleteGamificationPoint(constants.GAMIFICATION_EVENT_TYPE.RESTAURANT_ARCHIVE,request.body.restaurant_ids,request,function () {
                        vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                            .send();
                    });
                }else{
                    vincompassController.deleteGamificationPoint(constants.GAMIFICATION_EVENT_TYPE.FAVORITE_RESTAURANT,request.body.restaurant_ids,request,function () {
                        vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                            .send();
                    });
                }
            }else{
                vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                    .send();
            }
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    }
};