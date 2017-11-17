/**
 * Created by ravimodha on 07/01/17.
 */

var grapeController = require('../controllers/grape_controller');

var version = "v1";

module.exports = function (server) {
    server.get(version+"/grape/list",
        grapeController.getList
    );
};