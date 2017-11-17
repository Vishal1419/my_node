/**
 * Created by ravimodha on 23/08/16.
 */

module.exports = function (sequelize, DataTypes) {
    var MyPlaces = sequelize.define("MyPlaces", {
        customer_id: DataTypes.INTEGER,
        restaurant_id: DataTypes.INTEGER,
        last_visit: DataTypes.DATE,
        is_deleted: DataTypes.INTEGER
    },{
        tableName: "my_places"
    });

    return MyPlaces;
};