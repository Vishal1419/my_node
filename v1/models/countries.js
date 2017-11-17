/**
 * Created by ravimodha on 14/11/16.
 */

module.exports = function (sequelize, DataTypes) {
    var Countries = sequelize.define('Countries', {
        country:DataTypes.STRING,
        two_letter_code:DataTypes.STRING,
        three_letter_code:DataTypes.STRING,
        display_order:DataTypes.INTEGER
    },{
        tableName: "countries"
    });

    return Countries;
};