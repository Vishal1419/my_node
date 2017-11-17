/**
 * Created by ravimodha on 21/11/16.
 */

const foodController = require('../controllers/food_controller');

const versionConstants = require('../version_constants');

module.exports = function (server) {
    server.get(versionConstants.VERSION+"/food/get_list",
        foodController.getList
    );
};