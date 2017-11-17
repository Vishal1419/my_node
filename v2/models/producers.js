/**
 * Created by ravimodha on 14/11/16.
 */

module.exports = function (sequelize, DataTypes) {
    var Producers = sequelize.define('Producers', {
        producer:DataTypes.STRING,
        avg_price:DataTypes.DECIMAL(10,2),
        avg_geo_rate:DataTypes.DECIMAL(10,2),
        avg_critic_rate:DataTypes.DECIMAL(10,2),
        price_fulfilment:DataTypes.DECIMAL(10,2),
        defaultAddress:DataTypes.STRING,
        defaultBrand:DataTypes.STRING,
        defaultRegionNode:DataTypes.STRING,
        country:DataTypes.STRING(50),
        country_id:DataTypes.INTEGER,
        region:DataTypes.STRING(50),
        subregion:DataTypes.STRING(50),
        village:DataTypes.STRING(50),
        unique_reigonnode:DataTypes.INTEGER,
        multiple_country:DataTypes.INTEGER,
        cellar_id:DataTypes.INTEGER,
        clean_name:DataTypes.STRING,
        source:DataTypes.STRING(50)
    },{
        tableName: "producers"
    });

    return Producers;
};