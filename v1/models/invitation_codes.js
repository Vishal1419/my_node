/**
 * Created by ravimodha on 10/01/17.
 */

const constants = require(appRoot+'/common/constants');

module.exports = function (sequelize, DataTypes) {
    var InvitationCodes = sequelize.define("InvitationCodes",{
        invitation_code: DataTypes.STRING,
        name: DataTypes.STRING,
        hash: DataTypes.STRING,
        description: DataTypes.STRING,
        date_added: DataTypes.DATE,
        date_updated: DataTypes.DATE,
        start_time: DataTypes.DATE,
        expire_time: DataTypes.DATE,
        quantity: DataTypes.INTEGER,
        sponsor:DataTypes.STRING,
        used_times:DataTypes.INTEGER,
        registered_times:DataTypes.INTEGER,
        first_name:DataTypes.STRING,
        last_name:DataTypes.STRING,
        email:DataTypes.STRING,
        address:DataTypes.STRING,
        city:DataTypes.STRING,
        state:DataTypes.STRING,
        zip:DataTypes.STRING,
        country:DataTypes.STRING,
        latitude:DataTypes.STRING,
        code_type:DataTypes.ENUM(
            constants.INVITE_CODE_TYPE.FRIEND_INVITE,
            constants.INVITE_CODE_TYPE.NORMAL
        ),
        invite_medium:DataTypes.ENUM(
            constants.INVITE_MEDIUM.EMAIL,
            constants.INVITE_MEDIUM.SMS,
            constants.INVITE_MEDIUM.NONE
        ),
        longitude:DataTypes.STRING,
        add_user_id:DataTypes.INTEGER,
        edit_user_id:DataTypes.INTEGER,
        is_deleted:DataTypes.INTEGER,
        active:DataTypes.INTEGER
    },{
        tableName: "invitation_codes"
    });

    return InvitationCodes;
};