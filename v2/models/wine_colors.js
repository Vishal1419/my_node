/**
 * Created by ravimodha on 14/11/16.
 */

module.exports = function (sequelize, DataTypes) {
    var WineColors = sequelize.define('WineColors', {
        color:DataTypes.STRING(10)
    },{
        tableName: "wine_colors"
    });

    return WineColors;
};