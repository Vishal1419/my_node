/**
 * Created by ravimodha on 14/11/16.
 */

module.exports = function (sequelize, DataTypes) {
    var WinesDescription = sequelize.define('WinesDescription', {
        producer:DataTypes.STRING,
        producer_id:DataTypes.INTEGER,
        name:DataTypes.STRING,
        url_name:DataTypes.STRING,
        description:DataTypes.TEXT,
        village:DataTypes.STRING(50),
        grape:DataTypes.STRING,
        grape_new:DataTypes.STRING,
        grape_id:DataTypes.INTEGER,
        style:DataTypes.STRING,
        style_id:DataTypes.INTEGER,
        type:DataTypes.STRING,
        type_id:DataTypes.INTEGER,
        wine_category_label:DataTypes.STRING,
        color:DataTypes.STRING,
        color_id:DataTypes.INTEGER,
        subregion:DataTypes.STRING,
        subregion_id:DataTypes.INTEGER,
        region:DataTypes.STRING,
        region_id:DataTypes.INTEGER,
        country:DataTypes.STRING,
        country_id:DataTypes.INTEGER,
        active:DataTypes.INTEGER,
        position:DataTypes.INTEGER,
        is_deleted:DataTypes.INTEGER,
        added_date:DataTypes.DATE,
        updated_date:DataTypes.DATE,
        add_user_id:DataTypes.INTEGER,
        edit_customer_id:DataTypes.INTEGER,
        edit_user_id:DataTypes.INTEGER,
        package_id:DataTypes.INTEGER
    },{
        tableName: "wines_description"
    });

    return WinesDescription;
};