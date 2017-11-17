/**
 * Created by ravimodha on 06/01/17.
 */

module.exports = function (sequelize, DataTypes) {
    var CustomerAnswers = sequelize.define('CustomerAnswers', {
        customer_id:DataTypes.INTEGER,
        question_id:DataTypes.INTEGER,
        answer:DataTypes.STRING,
        survey_group:DataTypes.INTEGER,
        email:DataTypes.STRING,
        answer_id:DataTypes.INTEGER
    },{
        tableName: "customer_answers"
    });

    return CustomerAnswers;
};