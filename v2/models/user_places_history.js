/**
 * Created by ravimodha on 16/12/16.
 */

module.exports = function (sequelize, DataTypes) {
    var UserPlacesHistory = sequelize.define('UserPlacesHistory', {
        customer_id:DataTypes.INTEGER,
        restaurant_id:DataTypes.INTEGER,
        add_date:DataTypes.DATE,
        user_place_type:DataTypes.ENUM("MY_PLACE","MY_FAVORITE","MY_REMEMBER")
    },{
        tableName: "user_places_history"
    });

    return UserPlacesHistory;
};