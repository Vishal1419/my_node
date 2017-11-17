/**
 * Created by ravimodha on 27/04/17.
 */

const csvAnalyticController = require('../controllers/csv_analytic_controller');

const validateSchema = require('../validation_schema');
const versionConstants = require('../version_constants');

const ApplicationUtils = require(global.appRoot+"/common/application");

module.exports = function (server) {
    server.post(versionConstants.VERSION+"/csv/analytics/wine_wizard",
        ApplicationUtils.validateRequest(validateSchema.wwAnalytics),
        csvAnalyticController.trackWineWizard
    );

    server.post(versionConstants.VERSION+"/csv/analytics/selected_map_pin",
        ApplicationUtils.validateRequest(validateSchema.selectedPinAnalytics),
        csvAnalyticController.trackSelectedMapPin
    );

    server.post(versionConstants.VERSION+"/csv/analytics/wine_archive",
        ApplicationUtils.validateRequest(validateSchema.wineArchiveAnalytics),
        csvAnalyticController.trackWineArchive
    );

    server.post(versionConstants.VERSION+"/csv/analytics/restaurant_archive",
        ApplicationUtils.validateRequest(validateSchema.restaurantArchiveAnalytics),
        csvAnalyticController.trackRestaurantArchive
    );

    server.post(versionConstants.VERSION+"/csv/analytics/data_factory",
        ApplicationUtils.validateRequest(validateSchema.dataFactoryAnalytics),
        csvAnalyticController.trackDataFactoryAnalytics
    );

    server.post(versionConstants.VERSION+"/csv/analytics/restaurant/get_list",
        ApplicationUtils.validateRequest(validateSchema.restaurantListAnalytics),
        csvAnalyticController.trackRestaurantList
    );
};