/**
 * Created by ravimodha on 02/01/17.
 */

var countryController = require('../controllers/country_controller');

var version = "v1";

module.exports = function (server) {
    server.get(version+"/country/list",
        countryController.getList
    );
};