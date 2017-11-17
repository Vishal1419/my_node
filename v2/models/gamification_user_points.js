/**
 * Created by ravimodha on 18/01/17.
 */

module.exports = function (sequelize, DataTypes) {
    var GamificationUserPoints = sequelize.define('GamificationUserPoints', {
        customer_id:DataTypes.INTEGER,
        total_points:DataTypes.DOUBLE,
        add_date:DataTypes.DATE,
        edit_date:DataTypes.DATE
    },{
        tableName: "gamification_user_points"
    });

    return GamificationUserPoints;
};