/**
 * Created by ravimodha on 05/01/17.
 */

module.exports = function (sequelize, DataTypes) {
    var Questions = sequelize.define('Questions', {
        number:DataTypes.INTEGER,
        question:DataTypes.STRING,
        survey_group:DataTypes.INTEGER,
        answers_num:DataTypes.INTEGER,
        type:DataTypes.STRING,
        question_label:DataTypes.STRING
    },{
        tableName: "questions"
    });

    return Questions;
};