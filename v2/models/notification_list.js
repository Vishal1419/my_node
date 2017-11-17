/**
 * Created by ravimodha on 31/05/17.
 */

var constants = require(appRoot+'/common/constants');

module.exports = function (sequelize, DataTypes) {
    var NotificationList = sequelize.define('NotificationList', {
        alert_msg:DataTypes.STRING(200),
        payload:DataTypes.TEXT,
        type:DataTypes.ENUM(
            constants.NOTIFICATION_TYPE.SELECT_WINE
        ),
        platform_type:DataTypes.ENUM(
            constants.MOBILE_PLATFORM_TYPE.ANDROID,
            constants.MOBILE_PLATFORM_TYPE.IOS
        ),
        status:DataTypes.ENUM(
            constants.NOTIFICATION_STATUS.NEW,
            constants.NOTIFICATION_STATUS.IN_PROGRESS,
            constants.NOTIFICATION_STATUS.SENT
        ),
        device_arn:DataTypes.STRING(200),
        device_token:DataTypes.STRING(200),
        schedule_time:DataTypes.DATE,
        customer_email:DataTypes.STRING(100),
        customer_id:DataTypes.INTEGER,
        created_date:DataTypes.DATE,
        updated_date:DataTypes.DATE
    },{
        tableName: "notification_list"
    });

    return NotificationList;
};