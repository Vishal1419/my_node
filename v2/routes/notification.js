/**
 * Created by ravimodha on 22/05/17.
 */

const notiDelayGroupController = require('../controllers/noti_delay_controller');
const restaurantController = require('../controllers/restaurant_controller');
const notificationController = require('../controllers/notification_controller');

const validateSchema = require('../validation_schema');
const versionConstants = require('../version_constants');

const constants = require(global.appRoot+'/common/constants');

const ApplicationUtils = require(global.appRoot+"/common/application");
const Utility = require(appRoot+'/common/utility');
const VccResponse = require(appRoot+'/common/vcc_response');

module.exports = function (server) {
    server.get(versionConstants.VERSION+"/notification/delay_group/list",
        notiDelayGroupController.getList
    );

    server.get(versionConstants.VERSION+"/notification/delay_group/list/:page_no/:no_of_records",
        notiDelayGroupController.getList
    );

    server.post(versionConstants.VERSION+"/notification/delay_group/create",
        ApplicationUtils.validateRequest(validateSchema.notiDelayGroupCreate),
        notiDelayGroupController.create
    );

    server.post(versionConstants.VERSION+"/notification/delay_group/update",
        ApplicationUtils.validateRequest(validateSchema.notiDelayGroupUpdate),
        notiDelayGroupController.update
    );

    server.post(versionConstants.VERSION+"/notification/restaurant/list",
        ApplicationUtils.validateRequest(validateSchema.restaurantListForNotiGrp),
        restaurantController.getRestaurantListForNotiGrp
    );

    server.post(versionConstants.VERSION+"/notification/delay_group/assign",
        ApplicationUtils.validateRequest(validateSchema.assignNotiGrpToRestaurants),
        restaurantController.assignNotiDelayGrp
    );

    server.post(versionConstants.VERSION+"/notification/delay_group/delete",
        ApplicationUtils.validateRequest(validateSchema.deleteGroup),
        notiDelayGroupController.deleteGroup
    );

    server.post(versionConstants.VERSION+"/device_token/add",
        ApplicationUtils.validateRequest(validateSchema.addDeviceToken),
        function (request, response, next) {
            if(Utility.getDeviceTypeFromUserAgent(request) === constants.DEVICE_TYPE.IPHONE ||
                Utility.getDeviceTypeFromUserAgent(request) === constants.DEVICE_TYPE.ANDROID){
                next();
            }else{
                var vccResponse = new VccResponse(response);

                vccResponse.setStatusCode(VccResponse.INVALID_VALUE)
                    .setResponseBody({error: "This api is only for Mobile Platform"})
                    .send();
            }
        },
        notificationController.createArn
    );

    server.post(versionConstants.VERSION+"/notification/select_wine",
        ApplicationUtils.validateRequest(validateSchema.wineSelectNotification),
        function (request, response, next) {
            if(Utility.getDeviceTypeFromUserAgent(request) === constants.DEVICE_TYPE.IPHONE ||
                Utility.getDeviceTypeFromUserAgent(request) === constants.DEVICE_TYPE.ANDROID){
                next();
            }else{
                var vccResponse = new VccResponse(response);

                vccResponse.setStatusCode(VccResponse.INVALID_VALUE)
                    .setResponseBody({error: "This api is only for Mobile Platform"})
                    .send();
            }
        },
        notificationController.createSelectWineNotification
    );

    server.get(versionConstants.VERSION+"/notification/send_notification",
        notificationController.sendNotification
    );

    server.post(versionConstants.VERSION+"/notification/food_wine_pairing/rate",
        ApplicationUtils.validateRequest(validateSchema.foodWinePairRating),
        notificationController.foodWinePairingRate
    );

    server.get(versionConstants.VERSION+"/notification/list",
        notificationController.getNotificationList
    );

    server.get(versionConstants.VERSION+"/notification/read/:notification_id",
        ApplicationUtils.validateRequest(validateSchema.notificationReadStatus),
        notificationController.notificationRead
    );

    server.post(versionConstants.VERSION+"/notification/remove",
        ApplicationUtils.validateRequest(validateSchema.notificationDelete),
        notificationController.deleteNotification
    )
};
