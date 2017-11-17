/**
 * Created by ravimodha on 15/08/16.
 */

const fs = require('fs');
const path = require('path');
const imagemagick = require("imagemagick-native");

const userController = require('../controllers/user_controller');
const validateSchema = require('../validation_schema');
const constants = require(global.appRoot+'/common/constants');

const ApplicationUtils = require(global.appRoot+"/common/application");
const VccResponse = require(appRoot+'/common/vcc_response');

const version = "v1";

module.exports = function (server) {
    var Db = require("../db/db.js");

    server.get("user/test_api",function (request, response) {
        Db.getDbInstance();
        response.send("hello");
    });

    server.get(version+"/user/profile",
        userController.getProfile
    );

    server.post(version+"/user/survey_answers",
        ApplicationUtils.validateRequest(validateSchema.saveSurveyAnswers),
        userController.saveSurveyAnswers
    );

    server.get(version+"/user/friends",
        userController.getFriends
    );

    server.get(version+"/user/check_ins",
        userController.getCheckIns
    );

    server.get(version+"/user/check_ins/:customer_id",
        userController.getCheckIns
    );

    server.post(version+"/user/profile_pic",
        ApplicationUtils.getMulterForFile(path.join(global.appRoot,constants.PHYSICAL_IMAGE_PATH.USER_PROFILE_PIC_ORIGINAL)).single("profile_pic"),
        function (request, response) {
            if(request.file){
                fs.writeFileSync(path.join(appRoot,constants.PHYSICAL_IMAGE_PATH.USER_PROFILE_PIC_THUMB,request.file.filename),imagemagick.convert({
                    srcData: fs.readFileSync(path.join(appRoot,constants.PHYSICAL_IMAGE_PATH.USER_PROFILE_PIC_ORIGINAL,request.file.filename)),
                    width: 200,
                    height: 200,
                    resizeStyle: 'aspectfill',
                    gravity: 'Center'
                }));

                userController.setProfilePic(request,response);
            }else{
                var customResponse = new VccResponse(response);
                customResponse.setStatusCode(VccResponse.REQUIRED_FIELD)
                    .setResponseBody({error: constants.ERROR_MESSAGES.PROFILE_PIC_REQUIRED})
                    .send();
            }
        }
    );

    server.post(version+"/user/friend/invite",
        ApplicationUtils.validateRequest(validateSchema.sendFriendInvite),
        userController.sendInvite
    );

    server.post(version+"/user/password/change",
        ApplicationUtils.validateRequest(validateSchema.changePassword),
        userController.changePassword
    );

    server.get(version+"/user/archive_dashboard/count",
        userController.getArchiveDashboardCount
    );

    server.post(version+"/user/profile/save",
        ApplicationUtils.getMulterForFile(path.join(global.appRoot,constants.PHYSICAL_IMAGE_PATH.USER_PROFILE_PIC_ORIGINAL)).single("profile_pic"),
        function (request, response,next) {
            if(request.file){
                fs.writeFileSync(path.join(appRoot,constants.PHYSICAL_IMAGE_PATH.USER_PROFILE_PIC_THUMB,request.file.filename),imagemagick.convert({
                    srcData: fs.readFileSync(path.join(appRoot,constants.PHYSICAL_IMAGE_PATH.USER_PROFILE_PIC_ORIGINAL,request.file.filename)),
                    width: 200,
                    height: 200,
                    resizeStyle: 'aspectfill',
                    gravity: 'Center'
                }));
            }

            next();
        },
        function (request, response,next) {
            ApplicationUtils.validateParams(request.body,validateSchema.saveProfile,request,response,next,null);
        },
        function (request, response) {
            userController.saveProfile(request,response);
        }
    );

    server.get(version+"/user/gamification",
        userController.getGamification
    );
};