/**
 * Created by ravimodha on 01/08/16.
 */

global.appRoot = __dirname+'/';
global.enableNotification = true;

//Restify is used instead of express because we are building api, so we do not need templating and rendering.
const Restify = require('restify');
const VccResponse = require(appRoot+'/common/vcc_response');
const Memcache = require(appRoot+'/common/memcache');
const NotificationCron = require(appRoot+'/common/notification_cron');
const Utility = require(appRoot+'/common/utility');

// jwt is used for security
// for example:
//      user sends his username and password to authentication server
//      authentication server will then send the jwt to the user
//      Now if user want to use api then he will send his jwt to the application server while sending request
//      Application server will verify the jwt in incoming request and will respond if jwt was correct.
const jwt = require('jsonwebtoken');
const moment = require('moment'); //Package for formatting dates
const validate = require("validate.js"); //Package for validation
const validator = require("validator"); //Package used for validation
const config    = require(appRoot+"/app_config.js");
const constants = require(appRoot+'/common/constants');
const winston = require('winston'); //Logger -- database / file / console
const path = require('path'); //Package for working with file and directory paths
const underscore = require("underscore");// Underscore is a JavaScript library that provides a whole mess of useful functional programming helpers without extending any built-in objects.

var server = Restify.createServer({
    name: 'VinCompass',
    versions: ['1.0.0']
});

server.use(Restify.queryParser());
server.use(Restify.jsonBodyParser());

server.use(function (request,response,next){

    var pathArray = request.route.path.split("/");
    var apiVersion = pathArray[0];

    //token created by jwt is not required when accessing these routes
    var ignorePaths = Array(apiVersion+"/login",
        apiVersion+"/linked_in/login",
        apiVersion+"/affluence/login",
        apiVersion+"/affluence/user/login",
        apiVersion+"/invitation_code/validate",
        apiVersion+"/linked_in/register",
        apiVersion+"/affluence/register",
        apiVersion+"/survey/questions",
        apiVersion+"/invitation_code/validate",
        apiVersion+"/invitation/register",
        apiVersion+"/forgot_password/:email",
        apiVersion+"/word_press/create_token",
        apiVersion+"/notification/send_notification"
    );

    //check if request.route.path is not in ignore paths array
    if(ignorePaths.indexOf(request.route.path) == -1) {
        var vccResponse = new VccResponse(response);
        var accesssToken = request.headers["authorization"];

        if(validate.isEmpty(accesssToken) == true){
            vccResponse.setStatusCode(VccResponse.TOKEN_NOT_FOUND)
                .setResponseBody({error:constants.ERROR_MESSAGES.TOKEN_NOT_FOUND})
                .send();

        }else if(!validator.contains(accesssToken,"Bearer")){
            vccResponse.setStatusCode(VccResponse.TOKEN_NOT_FOUND)
                .setResponseBody({error:constants.ERROR_MESSAGES.TOKEN_NOT_FOUND})
                .send();
        }else{
            accesssToken = accesssToken.replace("Bearer ","");
            jwt.verify(accesssToken,constants.TOKEN_ENCRYPTION_KEY,function (err, decoded) {
                if(err){
                    vccResponse.setStatusCode(VccResponse.TOKEN_ERROR)
                        .setResponseBody({error:constants.ERROR_MESSAGES.INVALID_TOKEN})
                        .send();
                }else {
                    var isTokenExpired = moment(decoded.token_expire).isBefore(moment().utc().unix());

                    if(isTokenExpired == true){
                        vccResponse.setStatusCode(VccResponse.TOKEN_EXPIRED)
                            .setResponseBody({error:constants.ERROR_MESSAGES.TOKEN_EXPIRED})
                            .send();
                    }else{
                        if(Utility.isNull(decoded.token_type) === false && decoded.token_type === "WORD_PRESS"){
                            request.token = decoded;
                            next();
                        }else{
                            if(Utility.isNull(decoded.email) == false){
                                var userEmail = decoded.email;
                                Memcache.sharedInstance()
                                    .getMemcachePlus()
                                    .get(userEmail)
                                    .then(function (tokenArray) {
                                        // console.log('tokenArray: ' + tokenArray);
                                        if(Utility.isNull(tokenArray) == false){
                                            if(underscore.indexOf(tokenArray,accesssToken) == -1){
                                                vccResponse.setStatusCode(VccResponse.TOKEN_NOT_FOUND)
                                                    .setResponseBody({error:constants.ERROR_MESSAGES.TOKEN_NOT_FOUND})
                                                    .send();
                                            }else{
                                                request.token = decoded;
                                                next();
                                            }
                                        }else{
                                            vccResponse.setStatusCode(VccResponse.TOKEN_NOT_FOUND)
                                                .setResponseBody({error:constants.ERROR_MESSAGES.TOKEN_NOT_FOUND})
                                                .send();
                                        }
                                    });
                            }else{
                                vccResponse.setStatusCode(VccResponse.TOKEN_NOT_FOUND)
                                    .setResponseBody({error:constants.ERROR_MESSAGES.TOKEN_NOT_FOUND})
                                    .send();
                            }
                        }
                    }
                }
            });
        }
    }else{
        next();
    }
});

//winston.handleExceptions(new winston.transports.File({ filename: 'exceptions.log' }))

// winston.configure({
//     transports:config.ENV_CONFIG.logger.transports
// });

var routes = require('./routes')(server);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

server.listen(config.ENV_CONFIG.server.port,config.ENV_CONFIG.server.ip,function(err){
    console.log("Server Url : "+server.url);
    NotificationCron.sharedInstance().startNotificationCron();
});
