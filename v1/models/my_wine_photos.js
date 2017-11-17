/**
 * Created by ravimodha on 14/11/16.
 */

module.exports = function (sequelize, DataTypes) {
    var MyWinePhotos = sequelize.define('MyWinePhotos', {
        customer_id:DataTypes.INTEGER,
        menu_id:DataTypes.INTEGER,
        wine_id:DataTypes.INTEGER,
        photo:DataTypes.STRING,
        short_link:DataTypes.STRING,
        upload_date:DataTypes.DATE,
        use_image:DataTypes.INTEGER,
        short_url_photo:DataTypes.STRING,
        short_url_full_photo:DataTypes.STRING,
        url_photo:DataTypes.STRING,
        url_full_photo:DataTypes.STRING
    },{
        tableName: "my_wine_photos"
    });

    return MyWinePhotos;
};