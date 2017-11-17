/**
 * Created by ravimodha on 08/12/16.
 */

module.exports = function (sequelize, DataTypes) {
    var AffluenceUsersRestaurant = sequelize.define("AffluenceUsersRestaurant",{
        customer_id: DataTypes.INTEGER,
        email:DataTypes.STRING(200),
        first_name:DataTypes.STRING(150),
        last_name:DataTypes.STRING(200),
        phone_number:DataTypes.STRING(100),
        zip:DataTypes.STRING(20),
        restaurant_name:DataTypes.STRING(250),
        restaurant_address:DataTypes.STRING(250),
        restaurant_google_id:DataTypes.STRING(50),
        date_added:DataTypes.DATE,
        restaurant_id:DataTypes.INTEGER,
        stars_rated:DataTypes.INTEGER,
        aff_form:DataTypes.INTEGER,
        hash:DataTypes.STRING(100)

    },{
        tableName: "affluence_users_restaurant"
    });

    return AffluenceUsersRestaurant;
};