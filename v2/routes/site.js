/**
 * Created by ravimodha on 15/08/16.
 */

const siteController = require('../controllers/site_controller');
const validateSchema = require('../validation_schema');
const versionConstants = require('../version_constants');

const constants = require(appRoot+'/common/constants');

const Utility = require(appRoot+'/common/utility');
const ApplicationUtils = require(global.appRoot+"/common/application");

module.exports = function (server) {
    server.post(versionConstants.VERSION+"/login",
        ApplicationUtils.validateRequest(validateSchema.login),
        function (request, response) {
            siteController.login(request,response,constants.USER_TYPE.NORMAL);
        }
    );

    server.post(versionConstants.VERSION+"/linked_in/login",
        ApplicationUtils.validateRequest(validateSchema.linkedin_login),
        function (request, response) {
            siteController.login(request,response,constants.USER_TYPE.LINKED_IN);
        }
    );

    server.post(versionConstants.VERSION+"/affluence/login",
        ApplicationUtils.validateRequest(validateSchema.affluence_login),
        function (request, response) {
            siteController.login(request,response,constants.USER_TYPE.AFFLUENCE);
        }
    );

    server.get(versionConstants.VERSION+"/test_token",function (request, response) {
        response.send("Hello");
    });

    server.get(versionConstants.VERSION+"/invitation_code/validate",
        siteController.getSurveyQuestions
    );

    server.get(versionConstants.VERSION+"/survey/questions",
        siteController.getSurveyQuestions
    );

    server.post(versionConstants.VERSION+"/linked_in/register",
        ApplicationUtils.validateRequest(validateSchema.registerUser),
        ApplicationUtils.validateRequest(validateSchema.linkedInRegisteration),
        function (request, response, next) {
            request.body.user_type = constants.USER_TYPE.LINKED_IN;

            if(Utility.isNull(request.body.questions) == false){
                ApplicationUtils.validateParams(request.body,validateSchema.saveSurveyAnswers,request,response,next,null);
            }else{
                next();
            }
        },
        siteController.register
    );

    server.post(versionConstants.VERSION+"/affluence/register",
        ApplicationUtils.validateRequest(validateSchema.registerUser),
        function (request, response, next) {
            request.body.user_type = constants.USER_TYPE.AFFLUENCE;

            if(Utility.isNull(request.body.questions) == false){
                ApplicationUtils.validateParams(request.body,validateSchema.saveSurveyAnswers,request,response,next,null);
            }else{
                next();
            }
        },
        siteController.register
    );

    server.post(versionConstants.VERSION+"/invitation_code/validate",
        ApplicationUtils.validateRequest(validateSchema.inviteCode),
        siteController.validateInviteCode
    );

    server.post(versionConstants.VERSION+"/invitation/register",
        ApplicationUtils.validateRequest(validateSchema.inviteCode),
        ApplicationUtils.validateRequest(validateSchema.registerUser),
        function (request, response, next) {
            if(Utility.isNull(request.body.questions) == false){
                ApplicationUtils.validateParams(request.body,validateSchema.saveSurveyAnswers,request,response,next,null);
            }else{
                next();
            }
        },
        function (request, response, next) {
            siteController.registerViaInviteCode(request,response);
        }
    );

    server.get(versionConstants.VERSION+"/forgot_password/:email",
        ApplicationUtils.validateRequest(validateSchema.forgotPassword),
        siteController.forgotPassword
    );

    server.get(versionConstants.VERSION+"/test",
        siteController.testEmailTemplate
    );

    server.post(versionConstants.VERSION+"/affluence/user/login",
        ApplicationUtils.validateRequest(validateSchema.affluenceUserLogin),
        siteController.affluenceLogin
    );

    server.post(versionConstants.VERSION+"/affluence/user/login",
        ApplicationUtils.validateRequest(validateSchema.affluenceUserLogin),
        siteController.affluenceLogin
    );

    server.post(versionConstants.VERSION+"/word_press/create_token",
        ApplicationUtils.validateRequest(validateSchema.createTokenForWordPress),
        siteController.createTokenForWordPress
    );
};