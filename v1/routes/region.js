/**
 * Created by ravimodha on 24/11/16.
 */

var regionController = require('../controllers/region_controller');

var version = "v1";

module.exports = function (server) {
    server.get(version+"/region/get_list",
        regionController.getList
    );
};