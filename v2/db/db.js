/**
 * Created by ravimodha on 15/08/16.
 */

var Sequelize = require("sequelize");
var path      = require("path");

var config    = require(path.join(appRoot,"app_config.js")).ENV_CONFIG.db;

var sequelize = null;

function Db() {}

Db.getDbInstance = function () {
    if(!sequelize){
        sequelize = new Sequelize(config.database, config.username, config.password, config);
    }

    return sequelize;
};

module.exports = Db;