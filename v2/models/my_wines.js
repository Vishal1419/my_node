/**
 * Created by ravimodha on 14/11/16.
 */

module.exports = function (sequelize, DataTypes) {
    var MyWines = sequelize.define('MyWines', {
        menu_id:DataTypes.INTEGER,
        wine_id:DataTypes.INTEGER,
        customer_id:DataTypes.INTEGER,
        food_id:DataTypes.INTEGER,
        add_date:DataTypes.DATE,
        source:DataTypes.INTEGER,
        is_deleted:DataTypes.INTEGER
    },{
        tableName: "my_wines"
    });

    return MyWines;
};