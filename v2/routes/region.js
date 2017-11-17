/**
 * Created by ravimodha on 24/11/16.
 */

const regionController = require('../controllers/region_controller');

const versionConstants = require('../version_constants');

module.exports = function (server) {
    server.get(versionConstants.VERSION+"/region/get_list",
        regionController.getList
    );
};