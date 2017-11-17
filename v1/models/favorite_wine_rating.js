/**
 * Created by ravimodha on 07/12/16.
 */


module.exports = function (sequelize, DataTypes) {
    var FavoriteWineRating = sequelize.define('favorite_wine_rating', {
        wine_id:DataTypes.INTEGER,
        wine_name:DataTypes.STRING(400),
        email:DataTypes.STRING(200),
        first_name:DataTypes.STRING(150),
        last_name:DataTypes.STRING(200),
        phone_number:DataTypes.STRING(100),
        zip:DataTypes.STRING(20),
        country_id:DataTypes.INTEGER,
        region_id:DataTypes.INTEGER,
        color_id:DataTypes.INTEGER,
        grape_id:DataTypes.INTEGER,
        country_name:DataTypes.STRING(200),
        region_name:DataTypes.STRING(200),
        color_name:DataTypes.STRING(200),
        grape_name:DataTypes.STRING(200),
        stars_rated:DataTypes.INTEGER,
        aff_form:DataTypes.INTEGER,
        hash:DataTypes.STRING(100),
        date_added:DataTypes.DATE,
        active:DataTypes.INTEGER,
        is_deleted:DataTypes.INTEGER

    },{
        tableName: "favorite_wine_rating"
    });

    return FavoriteWineRating;
};