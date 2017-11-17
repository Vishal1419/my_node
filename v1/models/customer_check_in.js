/**
 * Created by ravimodha on 23/08/16.
 */

module.exports = function (sequelize, DataTypes) {
    var CustomerCheckIn = sequelize.define("CustomerCheckIn",{
        customer_id: DataTypes.INTEGER,
        restaurant_id: DataTypes.INTEGER,
        order: DataTypes.INTEGER,
        latitude: DataTypes.STRING,
        longitude: DataTypes.STRING,
        search_id: DataTypes.INTEGER,
        check_in_time: DataTypes.DATE,
        device: DataTypes.STRING
    },{
        tableName: "customer_check_in"
    });

    return CustomerCheckIn;
};