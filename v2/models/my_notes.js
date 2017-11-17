/**
 * Created by ravimodha on 14/11/16.
 */

module.exports = function (sequelize, DataTypes) {
    var MyNotes = sequelize.define('MyNotes', {
        customer_id:DataTypes.INTEGER,
        menu_id:DataTypes.INTEGER,
        wine_id:DataTypes.INTEGER,
        note:DataTypes.TEXT,
        add_date:DataTypes.DATE,
        edit_date:DataTypes.DATE,
        source:DataTypes.STRING
    },{
        tableName: "my_notes"
    });

    return MyNotes;
};