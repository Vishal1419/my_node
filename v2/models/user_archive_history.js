/**
 * Created by ravimodha on 21/12/16.
 */

var constants = require(appRoot+'/common/constants');

module.exports = function (sequelize, DataTypes) {
    var UserArchiveHistory = sequelize.define('UserArchiveHistory', {
        menu_id:DataTypes.INTEGER,
        wine_id:DataTypes.INTEGER,
        customer_id:DataTypes.INTEGER,
        food_id:DataTypes.INTEGER,
        add_date:DataTypes.DATE,
        source:DataTypes.INTEGER,
        archive_type:DataTypes.ENUM(
            constants.USER_ARCHIVE_TYPE.VIN_IN,
            constants.USER_ARCHIVE_TYPE.VIN_OUT,
            constants.USER_ARCHIVE_TYPE.MY_FAVORITE
        ),
        vin_type:DataTypes.ENUM(
            constants.USER_ARCHIVE_TYPE.WINE_CLUB,
            constants.USER_ARCHIVE_TYPE.MANUALLY
        )
    },{
        tableName: "user_archive_history"
    });

    return UserArchiveHistory;
};