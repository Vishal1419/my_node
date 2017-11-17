/**
 * Created by ravimodha on 19/12/16.
 */

module.exports = function (sequelize, DataTypes) {
    var PriceRange = sequelize.define('PriceRange', {
        value:DataTypes.STRING(10),
        from_price:DataTypes.INTEGER,
        to_price:DataTypes.INTEGER,
        active:DataTypes.INTEGER
    },{
        tableName: "price_range"
    });

    return PriceRange;
};