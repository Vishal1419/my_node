/**
 * Created by ravimodha on 20/08/16.
 */

const restaurantController = require('../controllers/restaurant_controller');
const validateSchema = require('../validation_schema');
const constants = require(global.appRoot+'/common/constants');

const ApplicationUtils = require(global.appRoot+"/common/application");
const Utility = require(appRoot+'/common/utility');

const version = "v1";

module.exports = function (server) {
    server.post(version+"/restaurant/get_list",
        ApplicationUtils.validateRequest(validateSchema.getRestaurantlist),
        restaurantController.getList
    );

    server.post(version+"/restaurant/check_in",
        ApplicationUtils.validateRequest(validateSchema.checkIn),
        function (request, response) {
            restaurantController.checkIn(request,response);
        }
    );

    server.get(version+"/restaurant/cuisine/get_list",
        restaurantController.getCuisine
    );

    server.get(version+"/restaurant/favorite/list",
        restaurantController.getFavList
    );

    server.get(version+"/restaurant/favorite/list/:page_no/:no_of_records",
        restaurantController.getFavList
    );

    server.post(version+"/restaurant/search",
        ApplicationUtils.validateRequest(validateSchema.searchRestaurant),
        function (request, response) {
            restaurantController.search(request,response,false);
        }
    );

    server.get(version+"/restaurant/:restaurant_id",
        ApplicationUtils.validateRequest(validateSchema.getRestaurantDetails),
        restaurantController.getDetail
    );

    server.post(version+"/restaurant/look_up",
        ApplicationUtils.validateRequest(validateSchema.restaurantLookUp),
        restaurantController.getRestaurantLookUp
    );

    server.post(version+"/restaurant/favorite/add",
        ApplicationUtils.validateRequest(validateSchema.favoriteRestaurant),
        restaurantController.addToFavorite
    );

    server.del(version+"/restaurant/favorite/:restaurant_id",
        ApplicationUtils.validateRequest(validateSchema.favoriteRestaurant),
        restaurantController.removeFromFavorite
    );

    server.get(version+"/restaurant/my_places/list",
        restaurantController.getMyPlaces
    );

    server.get(version+"/restaurant/my_places/list/:page_no/:no_of_records",
        restaurantController.getMyPlaces
    );

    server.post(version+"/restaurant/remember/add",
        ApplicationUtils.validateRequest(validateSchema.favoriteRestaurant),
        restaurantController.addToMyRemember
    );

    server.post(version+"/restaurant/neighborhood/lookup",
        ApplicationUtils.validateRequest(validateSchema.neighborhoodLookUp),
        restaurantController.neighborhoodLookUp
    );

    server.post(version+"/restaurant/favorite/search",
        function (request, response, next) {
            if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.WEB) {
                ApplicationUtils.validateParams(request.body,validateSchema.searchRestaurant,request,response,next,null);
            }else{
                ApplicationUtils.validateParams(request.body,validateSchema.searchRestaurantToAddToFavorite,request,response,next,null);
            }
        },
        function (request, response) {
            if(Utility.getSourceTypeFromUserAgent(request) == constants.SOURCE_TYPE.WEB) {
                restaurantController.search(request, response, true);
            }else{
                restaurantController.searchToAddFavorite(request,response);
            }
        }
    );

    server.post(version+"/restaurant/places/remove",
        ApplicationUtils.validateRequest(validateSchema.removeUserPlace),
        restaurantController.removePlace
    );
};