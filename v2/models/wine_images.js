/**
 * Created by ravimodha on 14/11/16.
 */

module.exports = function (sequelize, DataTypes) {
    var WineImages = sequelize.define('WineImages', {
        image:DataTypes.STRING,
        wine_id:DataTypes.INTEGER,
        wd_id:DataTypes.INTEGER,
        featured_image:DataTypes.INTEGER,
        position:DataTypes.INTEGER,
        added_date:DataTypes.DATE,
        add_customer_id:DataTypes.INTEGER,
        add_user_id:DataTypes.INTEGER,
        short_url_photo:DataTypes.STRING,
        short_url_full_photo:DataTypes.STRING,
        url_photo:DataTypes.STRING,
        url_full_photo:DataTypes.STRING,
        borrowed_image:DataTypes.INTEGER,
        source:DataTypes.STRING(45),
        cropped:DataTypes.INTEGER,
        borrowed_from:DataTypes.STRING(45),
        resized:DataTypes.DATE

    },{
        tableName: "wine_images"
    });

    return WineImages;
};