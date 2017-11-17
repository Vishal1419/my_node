/**
 * Created by ravimodha on 14/11/16.
 */

module.exports = function (sequelize, DataTypes) {
    var Grapes = sequelize.define('Grapes', {
        grape:DataTypes.STRING,
        color:DataTypes.STRING(5),
        color_id:DataTypes.INTEGER,
        abbreviation:DataTypes.STRING(3),
        blend:DataTypes.INTEGER,
        delete:DataTypes.INTEGER,
        fruit:DataTypes.INTEGER,
        position:DataTypes.INTEGER,
        related_grape:DataTypes.STRING,
        position_old:DataTypes.INTEGER
    },{
        tableName: "grapes"
    });

    return Grapes;
};