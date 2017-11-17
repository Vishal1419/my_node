/**
 * Created by ravimodha on 02/09/16.
 */

var fs = require('fs');
var validator = require('isvalid');
var multer  = require('multer');
var path = require('path');

const util = require('util')

var VccResponse = require(appRoot+'/common/vcc_response');

var ApplicationUtils = function (){};

ApplicationUtils.getMulterForFile = function(destinationDir){
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            var stat = null;
            try {
                stat = fs.statSync(destinationDir);
            } catch (err) {
                fs.mkdirSync(destinationDir);
            }
            if (stat && !stat.isDirectory()) {
                throw new Error('Directory cannot be created because an inode of a different type exists at "' + destinationDir + '"');
            }

            cb(null, destinationDir)
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });

    return multer({ storage: storage });
};

ApplicationUtils.validateRequest = function(schema,errorCallback){
    return function validate(request,response,next){
        validator((request.body || request.params),
            schema,
            function(err){
                if(!err) {
                    next();
                }else {
                    if(errorCallback !== undefined){
                        errorCallback(request,response);
                    }

                    var customResponse = new VccResponse(response);
                    customResponse.setStatusCode(err.message.errorCode)
                        .setResponseBody({error: err.message.message})
                        .send();
                }
            }
        );
    };
};

ApplicationUtils.validateParams = function (params, schema, request, response, next, errorCallback) {
    validator(params,
        schema,
        function (error) {
            if(!error){
                next();
            }else{
                if(errorCallback != undefined){
                    errorCallback(request,response);
                }

                var customResponse = new VccResponse(response);
                customResponse.setStatusCode(error.message.errorCode)
                    .setResponseBody({error: error.message.message})
                    .send();
            }
        });
};

module.exports = ApplicationUtils;
