/**
 * Created by ravimodha on 14/11/16.
 */

module.exports = function (sequelize, DataTypes) {
    var WineTypes = sequelize.define('WineTypes', {
        type:DataTypes.STRING(25)
    },{
        tableName: "wine_types"
    });

    return WineTypes;
};