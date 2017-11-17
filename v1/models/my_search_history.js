/**
 * Created by ravimodha on 22/08/16.
 */

module.exports = function (sequelize, DataTypes) {
    var MySearchHistory = sequelize.define("MySearchHistory",{
        search: DataTypes.STRING,
        address: DataTypes.STRING,
        latitude: DataTypes.STRING(12),
        longitude: DataTypes.STRING(12),
        customer_id: DataTypes.INTEGER,
        add_date: DataTypes.DATE,
        num_rows: DataTypes.INTEGER,
        radius: DataTypes.INTEGER,
        mockup: DataTypes.INTEGER,
        device: DataTypes.STRING,
        web_restaurant_name: DataTypes.STRING,
        web_wine_name: DataTypes.STRING,
        web_city: DataTypes.STRING,
        web_state: DataTypes.STRING,
        web_zip_code: DataTypes.STRING,
        web_address: DataTypes.STRING
    },{
        tableName: "my_search_history"
    });

    return MySearchHistory;
};