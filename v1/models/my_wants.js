/**
 * Created by ravimodha on 14/11/16.
 */

module.exports = function (sequelize, DataTypes) {
    var MyWants = sequelize.define('MyWants', {
        menu_id:DataTypes.INTEGER,
        wine_id:DataTypes.INTEGER,
        customer_id:DataTypes.INTEGER,
        food_id:DataTypes.INTEGER,
        add_date:DataTypes.DATE,
        source:DataTypes.INTEGER,
        is_deleted:DataTypes.INTEGER
    },{
        tableName: "my_wants"
    });

    return MyWants;
};