/**
 * Created by ravimodha on 14/11/16.
 */

module.exports = function (sequelize, DataTypes) {
    var MyAudios = sequelize.define('MyAudios', {
        customer_id:DataTypes.INTEGER,
        menu_id:DataTypes.INTEGER,
        wine_id:DataTypes.INTEGER,
        audio_file:DataTypes.STRING,
        short_link:DataTypes.STRING,
        upload_date:DataTypes.DATE
    },{
        tableName: "my_audios"
    });

    return MyAudios;
};