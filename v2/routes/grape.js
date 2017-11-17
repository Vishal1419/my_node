/**
 * Created by ravimodha on 07/01/17.
 */

const grapeController = require('../controllers/grape_controller');

const versionConstants = require('../version_constants');

module.exports = function (server) {
    server.get(versionConstants.VERSION+"/grape/list",
        grapeController.getList
    );
};