/**
 * Created by ravimodha on 21/11/16.
 */

var foodController = require('../controllers/food_controller');

var version = "v1";

module.exports = function (server) {
    server.get(version+"/food/get_list",
        foodController.getList
    );
};