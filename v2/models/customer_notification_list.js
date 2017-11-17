/**
 * Created by ravimodha on 21/06/17.
 */

module.exports = function (sequelize, DataTypes) {
    var CustomerNotificationList = sequelize.define('CustomerNotificationList', {
        notification_id:{
            type:DataTypes.INTEGER,
            primaryKey: true
        },
        subject:DataTypes.STRING(100),
        message:DataTypes.TEXT,
        is_read:DataTypes.INTEGER,
        customer_id:DataTypes.INTEGER,
        created_date:DataTypes.DATE,
        updated_date:DataTypes.DATE
    },{
        tableName: "customer_notification_list"
    });

    return CustomerNotificationList;
};