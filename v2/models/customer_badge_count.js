/**
 * Created by ravimodha on 21/06/17.
 */

const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
    var CustomerBadgeCount = sequelize.define('CustomerBadgeCount', {
        badge_count:DataTypes.INTEGER,
        customer_id:DataTypes.INTEGER,
        created_date:DataTypes.DATE,
        updated_date:DataTypes.DATE
    },{
        tableName: "customer_badge_count"
    });

    return CustomerBadgeCount;
};