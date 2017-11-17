/**
 * Created by ravimodha on 20/08/16.
 */

module.exports = function (sequelize, DataTypes) {
    var RestaurantImages = sequelize.define('RestaurantImages',{
        image: DataTypes.STRING,
        short_link: DataTypes.STRING,
        restaurant_id: DataTypes.INTEGER,
        featured_image: DataTypes.INTEGER,
        position: DataTypes.INTEGER,
        added_date: DataTypes.DATE,
        add_customer_id: DataTypes.INTEGER,
        add_user_id: DataTypes.INTEGER,
        short_url_photo: DataTypes.STRING,
        short_url_full_photo: DataTypes.STRING,
        url_photo: DataTypes.STRING,
        url_full_photo: DataTypes.STRING
    },{
        tableName: "restaurant_images"
    });

    return RestaurantImages;
};