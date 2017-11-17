/**
 * Created by ravimodha on 19/12/16.
 */

const priceController = require('../controllers/price_controller');

const versionConstants = require('../version_constants');

module.exports = function (server) {
    server.get(versionConstants.VERSION+"/price/get_list",
        priceController.getList
    );
};