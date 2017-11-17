/**
 * Created by ravimodha on 01/06/17.
 */

module.exports = function (sequelize, DataTypes) {
    var NotificationResults = sequelize.define('NotificationResults', {
        notification_list_id:DataTypes.INTEGER,
        message_id:DataTypes.STRING(200),
        payload:DataTypes.TEXT,
        error:DataTypes.TEXT,
        created_date:DataTypes.DATE
    },{
        tableName: "notification_results"
    });

    return NotificationResults;
};