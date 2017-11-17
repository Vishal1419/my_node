/**
 * Created by ravimodha on 15/08/16.
 */

var Restify = require('restify');

var siteController = require('../controllers/site_controller');
var validateSchema = require('../validation_schema');
var constants = require(appRoot+'/common/constants');

var VccResponse = require(appRoot+'/common/vcc_response');
var Utility = require(appRoot+'/common/utility');
var ApplicationUtils = require(global.appRoot+"/common/application");

var version = "v1";

module.exports = function (server) {
    server.get("/login",function (request, response) {
        var vccResponse = new VccResponse(response);

        var entryptedText = Utility.encryptText("Test123",constants.OPENSSL_METHOD,constants.CUSTOMER_ID_ENCRYPT_KEY);

        var decryptedText = Utility.decryptText(entryptedText,constants.OPENSSL_METHOD,constants.CUSTOMER_ID_ENCRYPT_KEY);

        vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
            .setResponseBody({encrypted:entryptedText,decrypted:decryptedText})
            .send();
    });


    server.post(version+"/login",
        ApplicationUtils.validateRequest(validateSchema.login),
        function (request, response) {
            siteController.login(request,response,constants.USER_TYPE.NORMAL);
        }
    );

    server.post(version+"/linked_in/login",
        ApplicationUtils.validateRequest(validateSchema.linkedin_login),
        function (request, response) {
            siteController.login(request,response,constants.USER_TYPE.LINKED_IN);
        }
    );

    server.post(version+"/affluence/login",
        ApplicationUtils.validateRequest(validateSchema.affluence_login),
        function (request, response) {
            siteController.login(request,response,constants.USER_TYPE.AFFLUENCE);
        }
    );

    server.get(version+"/test_token",function (request, response) {
        response.send("Hello");
    });

    server.get(version+"/invitation_code/validate",
        siteController.getSurveyQuestions
    );

    server.get(version+"/survey/questions",
        siteController.getSurveyQuestions
    );

    server.post(version+"/linked_in/register",
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

    server.post(version+"/affluence/register",
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

    server.post(version+"/invitation_code/validate",
        ApplicationUtils.validateRequest(validateSchema.inviteCode),
        siteController.validateInviteCode
    );

    server.post(version+"/invitation/register",
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

    server.get(version+"/forgot_password/:email",
        ApplicationUtils.validateRequest(validateSchema.forgotPassword),
        siteController.forgotPassword
    );

    server.get(version+"/test",
        siteController.testEmailTemplate
    );

    server.post(version+"/affluence/user/login",
        ApplicationUtils.validateRequest(validateSchema.affluenceUserLogin),
        siteController.affluenceLogin
    );
};