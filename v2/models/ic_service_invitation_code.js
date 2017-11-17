/**
 * Created by ravimodha on 21/01/17.
 */

const constants = require(appRoot+'/common/constants');

module.exports = function (sequelize, DataTypes) {
    var IcServiceInvitationCode = sequelize.define("IcServiceInvitationCode",{
        name: DataTypes.STRING,
        first_name:DataTypes.STRING(100),
        last_name:DataTypes.STRING(100),
        email:DataTypes.STRING(50),
        mobile:DataTypes.STRING(50),
        code: DataTypes.STRING,
        start: DataTypes.DATE,
        end: DataTypes.DATE,
        quantity: DataTypes.INTEGER,
        attempts:DataTypes.INTEGER,
        registrations:DataTypes.INTEGER,
        code_type:DataTypes.ENUM(
            constants.INVITE_CODE_TYPE.FRIEND_INVITE,
            constants.INVITE_CODE_TYPE.NORMAL
        ),
        invite_medium:DataTypes.ENUM(
            constants.INVITE_MEDIUM.EMAIL,
            constants.INVITE_MEDIUM.SMS,
            constants.INVITE_MEDIUM.NONE
        ),
        active:DataTypes.INTEGER,
        add_user_id:DataTypes.INTEGER,
        edit_user_id:DataTypes.INTEGER,
        deleted_at: DataTypes.DATE,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE
    },{
        tableName: "ic_service_invitation_code"
    });

    return IcServiceInvitationCode;
};