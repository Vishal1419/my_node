/**
 * Created by ravimodha on 14/11/16.
 */

module.exports = function (sequelize, DataTypes) {
    var Regions = sequelize.define('Regions', {
        regionNode_id:DataTypes.INTEGER,
        name:DataTypes.STRING,
        country:DataTypes.STRING,
        country_id:DataTypes.INTEGER
    },{
        tableName: "regions"
    });

    return Regions;
};