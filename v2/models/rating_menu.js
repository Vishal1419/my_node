/**
 * Created by ravimodha on 14/11/16.
 */

module.exports = function (sequelize, DataTypes) {
    var RatingMenu = sequelize.define('RatingMenu', {
        wine_id:DataTypes.INTEGER,
        rate:DataTypes.DECIMAL(10,2),
        customer_id:DataTypes.INTEGER,
        comment:DataTypes.TEXT,
        web:DataTypes.INTEGER,
        date:DataTypes.DATE
    },{
        tableName: "rating_menu"
    });

    return RatingMenu;
};