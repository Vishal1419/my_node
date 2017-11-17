/**
 * Created by ravimodha on 18/01/17.
 */

var constants = require(appRoot+'/common/constants');

module.exports = function (sequelize, DataTypes) {
    var GamificationUserPointHistory = sequelize.define('GamificationUserPointHistory', {
        customer_id:DataTypes.INTEGER,
        point:DataTypes.FLOAT,
        event_type:DataTypes.ENUM(
            constants.GAMIFICATION_EVENT_TYPE.QUESTIONS,
            constants.GAMIFICATION_EVENT_TYPE.RESTAURANT_ARCHIVE,
            constants.GAMIFICATION_EVENT_TYPE.WINE_ARCHIVE,
            constants.GAMIFICATION_EVENT_TYPE.WINE_RATED,
            constants.GAMIFICATION_EVENT_TYPE.FAVORITE_RESTAURANT,
            constants.GAMIFICATION_EVENT_TYPE.FAVORITE_WINE,
            constants.GAMIFICATION_EVENT_TYPE.FRIEND_INVITED
        ),
        restaurant_id:DataTypes.INTEGER,
        wine_id:DataTypes.INTEGER,
        question_id:DataTypes.INTEGER,
        friend_id:DataTypes.INTEGER,
        add_date:DataTypes.DATE
    },{
        tableName: "gamification_user_point_history"
    });

    return GamificationUserPointHistory;
};