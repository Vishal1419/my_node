/**
 * Created by ravimodha on 20/08/16.
 */

const restaurantController = require('../controllers/restaurant_controller');
const validateSchema = require('../validation_schema');
const versionConstants = require('../version_constants');

const constants = require(global.appRoot+'/common/constants');

const ApplicationUtils = require(global.appRoot+"/common/application");
const Utility = require(appRoot+'/common/utility');

module.exports = function (server) {
    server.post(versionConstants.VERSION+"/restaurant/get_list",
        ApplicationUtils.validateRequest(validateSchema.getRestaurantlist),
        restaurantController.getList
    );

    server.post(versionConstants.VERSION+"/restaurant/check_in",
        ApplicationUtils.validateRequest(validateSchema.checkIn),
        function (request, response) {
            restaurantController.checkIn(request,response);
        }
    );

    server.get(versionConstants.VERSION+"/restaurant/cuisine/get_list",
        restaurantController.getCuisine
    );

    server.get(versionConstants.VERSION+"/restaurant/favorite/list",
        restaurantController.getFavList
    );

    server.get(versionConstants.VERSION+"/restaurant/favorite/list/:page_no/:no_of_records",
        restaurantController.getFavList
    );

    server.post(versionConstants.VERSION+"/restaurant/search",
        ApplicationUtils.validateRequest(validateSchema.searchRestaurant),
        function (request, response) {
            restaurantController.search(request,response,false);
        }
    );

    server.get(versionConstants.VERSION+"/restaurant/:restaurant_id",
        ApplicationUtils.validateRequest(validateSchema.getRestaurantDetails),
        restaurantController.getDetail
    );

    server.post(versionConstants.VERSION+"/restaurant/look_up",
        ApplicationUtils.validateRequest(validateSchema.restaurantLookUp),
        restaurantController.getRestaurantLookUp
    );

    server.post(versionConstants.VERSION+"/restaurant/favorite/add",
        ApplicationUtils.validateRequest(validateSchema.favoriteRestaurant),
        restaurantController.addToFavorite
    );

    server.del(versionConstants.VERSION+"/restaurant/favorite/:restaurant_id",
        ApplicationUtils.validateRequest(validateSchema.favoriteRestaurant),
        restaurantController.removeFromFavorite
    );

    server.get(versionConstants.VERSION+"/restaurant/my_places/list",
        restaurantController.getMyPlaces
    );

    server.get(versionConstants.VERSION+"/restaurant/my_places/list/:page_no/:no_of_records",
        restaurantController.getMyPlaces
    );

    server.post(versionConstants.VERSION+"/restaurant/remember/add",
        ApplicationUtils.validateRequest(validateSchema.favoriteRestaurant),
        restaurantController.addToMyRemember
    );

    server.post(versionConstants.VERSION+"/restaurant/neighborhood/lookup",
        ApplicationUtils.validateRequest(validateSchema.neighborhoodLookUp),
        restaurantController.neighborhoodLookUp
    );

    server.post(versionConstants.VERSION+"/restaurant/favorite/search",
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

    server.post(versionConstants.VERSION+"/restaurant/places/remove",
        ApplicationUtils.validateRequest(validateSchema.removeUserPlace),
        restaurantController.removePlace
    );
};