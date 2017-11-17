/**
 * Created by ravimodha on 14/11/16.
 */

module.exports = function (sequelize, DataTypes) {
    var WineStyles = sequelize.define('WineStyles', {
        style:DataTypes.STRING(25)
    },{
        tableName: "wine_styles"
    });

    return WineStyles;
};