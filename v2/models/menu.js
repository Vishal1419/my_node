/**
 * Created by ravimodha on 14/11/16.
 */

module.exports = function (sequelize, DataTypes) {
    var Menu = sequelize.define('Menu', {
        restaurant_id:DataTypes.INTEGER,
        wine_id:DataTypes.INTEGER,
        wine_description_id:DataTypes.INTEGER,
        name:DataTypes.STRING,
        menu_description:DataTypes.TEXT,
        price:DataTypes.DECIMAL(10,2),
        average_rate:DataTypes.DECIMAL(10,2),
        score:DataTypes.DECIMAL(10,2),
        active:DataTypes.INTEGER,
        added_date:DataTypes.DATE,
        updated_date:DataTypes.DATE,
        add_customer_id:DataTypes.INTEGER,
        add_user_id:DataTypes.INTEGER,
        edit_customer_id:DataTypes.INTEGER,
        edit_user_id:DataTypes.INTEGER,
        menu_numb:DataTypes.STRING,
        added_from:DataTypes.DATE,
        estimated_price:DataTypes.INTEGER,
        estimated_vintage:DataTypes.INTEGER,
        add_source:DataTypes.STRING(12),
        add_id:DataTypes.INTEGER,
        is_deleted:DataTypes.INTEGER
    },{
        tableName: "menu"
    });

    return Menu;
};