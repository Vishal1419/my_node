/**
 * Created by ravimodha on 03/03/17.
 */

var constants = require(appRoot+'/common/constants');

module.exports = function (sequelize, DataTypes) {
    var RadiusConfig = sequelize.define('RadiusConfig', {
        radius:DataTypes.INTEGER,
        record_limit:DataTypes.INTEGER,
        config_type:DataTypes.ENUM(
            constants.SOURCE_TYPE.WEB,
            constants.SOURCE_TYPE.MOBILE
        )
    },{
        tableName: "radius_config"
    });

    return RadiusConfig;
};