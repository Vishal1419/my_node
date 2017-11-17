/**
 * Created by ravimodha on 18/01/17.
 */

var constants = require(appRoot+'/common/constants');

module.exports = function (sequelize, DataTypes) {
    var GamificationEventsPoint = sequelize.define('GamificationEventsPoint', {
        event:DataTypes.ENUM(
            constants.GAMIFICATION_EVENT_TYPE.QUESTIONS,
            constants.GAMIFICATION_EVENT_TYPE.RESTAURANT_ARCHIVE,
            constants.GAMIFICATION_EVENT_TYPE.WINE_ARCHIVE,
            constants.GAMIFICATION_EVENT_TYPE.WINE_RATED,
            constants.GAMIFICATION_EVENT_TYPE.FAVORITE_RESTAURANT,
            constants.GAMIFICATION_EVENT_TYPE.FAVORITE_WINE,
            constants.GAMIFICATION_EVENT_TYPE.FRIEND_INVITED
        ),
        add_point:DataTypes.FLOAT,
        minus_point:DataTypes.FLOAT
    },{
        tableName: "gamification_events_point"
    });

    return GamificationEventsPoint;
};