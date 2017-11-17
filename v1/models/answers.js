/**
 * Created by ravimodha on 05/01/17.
 */

module.exports = function (sequelize, DataTypes) {
    var Answers = sequelize.define('Answers', {
        q_id:DataTypes.INTEGER,
        answer:DataTypes.STRING,
        full_answer:DataTypes.INTEGER,
        display_order:DataTypes.INTEGER,
        survey_group:DataTypes.INTEGER,
        is_default:DataTypes.INTEGER
    },{
        tableName: "answers"
    });

    return Answers;
};