/**
 * Created by ravimodha on 02/01/17.
 */

const countryController = require('../controllers/country_controller');
const versionConstants = require('../version_constants');

module.exports = function (server) {
    server.get(versionConstants.VERSION+"/country/list",
        countryController.getList
    );
};