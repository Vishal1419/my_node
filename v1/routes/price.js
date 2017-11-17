/**
 * Created by ravimodha on 19/12/16.
 */

var priceController = require('../controllers/price_controller');

var version = "v1";

module.exports = function (server) {
    server.get(version+"/price/get_list",
        priceController.getList
    );
};