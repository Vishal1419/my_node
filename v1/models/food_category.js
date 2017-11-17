/**
 * Created by ravimodha on 21/11/16.
 */

module.exports = function (sequelize, DataTypes) {
    var FoodCategory = sequelize.define('FoodCategory', {
        name:DataTypes.STRING,
        order:DataTypes.INTEGER
    },{
        tableName: "food_category"
    });

    return FoodCategory;
};