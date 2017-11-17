/**
 * Created by ravimodha on 22/05/17.
 */

module.exports = function (sequelize, DataTypes) {
    var NotiDelayGroup = sequelize.define('NotiDelayGroup', {
        name:DataTypes.STRING(50),
        delay:DataTypes.INTEGER,
        is_default:DataTypes.INTEGER,
        created_date:DataTypes.DATE,
        updated_date:DataTypes.DATE
    },{
        tableName: "noti_delay_group"
    });

    return NotiDelayGroup;
};