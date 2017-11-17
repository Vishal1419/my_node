/**
 * Created by ravimodha on 14/11/16.
 */

var customDataTypes = require(global.appRoot+'lib/custom_data_types/timestamp');

module.exports = function (sequelize, DataTypes) {
    var Wines = sequelize.define('Wines', {
        wine_description_id:DataTypes.INTEGER,
        vintage:DataTypes.STRING(10),
        price:DataTypes.DECIMAL(10,2),
        score:DataTypes.INTEGER,
        description:DataTypes.STRING,
        average_rate:DataTypes.DECIMAL(10,2),
        wine_name:DataTypes.STRING,
        package_id:DataTypes.INTEGER,
        added_date:customDataTypes.TIMESTAMP,
        updated_date:DataTypes.DATE,
        add_user_id:DataTypes.INTEGER,
        edit_user_id:DataTypes.INTEGER,
        active:DataTypes.INTEGER,
        is_deleted:DataTypes.INTEGER,
        geo_rate:DataTypes.INTEGER,
        critic_rate:DataTypes.INTEGER,
        CG:DataTypes.INTEGER,
        WS:DataTypes.INTEGER,
        RP:DataTypes.INTEGER,
        WA:DataTypes.INTEGER,
        st:DataTypes.INTEGER,
        client_rating:DataTypes.INTEGER,
        estimated_price:DataTypes.INTEGER,
        cost:DataTypes.DECIMAL(10,2),
        wa_id:DataTypes.INTEGER,
        geo_description:DataTypes.STRING,
        added_from:DataTypes.INTEGER,
        sku_vc:DataTypes.STRING(20)
    },{
        tableName: "wines"
    });

    return Wines;
};