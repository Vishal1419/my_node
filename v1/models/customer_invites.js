/**
 * Created by ravimodha on 07/01/17.
 */

module.exports = function (sequelize, DataTypes) {
    var CustomerInvites = sequelize.define("CustomerInvites",{
        customer_id: DataTypes.INTEGER,
        friend_id: DataTypes.INTEGER,
        friend_id_old: DataTypes.INTEGER,
        friend_email: DataTypes.STRING,
        friend_first_name: DataTypes.STRING,
        friend_last_name: DataTypes.STRING,
        date_added: DataTypes.DATE,
        medium: DataTypes.STRING,
        influence:DataTypes.INTEGER,
        friends_influence:DataTypes.INTEGER,
        source:DataTypes.INTEGER,
        is_sent:DataTypes.INTEGER,
        is_removed:DataTypes.INTEGER,
        hash:DataTypes.STRING,
        expires_on_api:DataTypes.INTEGER,
        reminder_sent:DataTypes.INTEGER,
        reminder_inactive:DataTypes.INTEGER

    },{
        tableName: "customer_invites"
    });

    return CustomerInvites;
};