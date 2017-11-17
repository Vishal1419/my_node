/**
 * Created by ravimodha on 24/12/16.
 */

module.exports = function (sequelize, DataTypes) {
    var NeighborhoodCityStateMaps = sequelize.define('NeighborhoodCityStateMaps', {
        neighborhood:DataTypes.STRING(100),
        city:DataTypes.STRING(100),
        state:DataTypes.STRING(100),
        latitude:DataTypes.DOUBLE,
        longitude:DataTypes.DOUBLE
    },{
        tableName: "neighborhood_city_state_maps"
    });

    return NeighborhoodCityStateMaps;
};