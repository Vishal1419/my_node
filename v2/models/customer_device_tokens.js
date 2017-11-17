/**
 * Created by ravimodha on 27/05/17.
 */

var constants = require(appRoot+'/common/constants');

module.exports = function (sequelize, DataTypes) {
    var CustomerDeviceTokens = sequelize.define("CustomerDeviceTokens",{
        device_token: DataTypes.STRING(200),
        device_arn: DataTypes.STRING(200),
        customer_email: DataTypes.STRING(60),
        platform:DataTypes.ENUM(
            constants.MOBILE_PLATFORM_TYPE.IOS,
            constants.MOBILE_PLATFORM_TYPE.ANDROID
        ),
        enable:DataTypes.INTEGER,
        created_date: DataTypes.DATE,
        updated_date: DataTypes.DATE

    },{
        tableName: "customer_device_tokens"
    });

    return CustomerDeviceTokens;
};