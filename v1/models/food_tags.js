/**
 * Created by ravimodha on 21/11/16.
 */

module.exports = function (sequelize, DataTypes) {
    var FoodTags = sequelize.define('FoodTags', {
        food_name:DataTypes.STRING,
        food_category:DataTypes.STRING,
        first_choice:DataTypes.STRING,
        second_choice:DataTypes.STRING,
        third_choice:DataTypes.STRING
    },{
        tableName: "food_tags"
    });

    return FoodTags;
};