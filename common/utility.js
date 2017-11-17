/**
 * Created by ravimodha on 15/08/16.
 */

var crypto = require("crypto");
var validator = require('validator');
var constants = require(global.appRoot+'/common/constants');

var Utility = function () {};

Utility.encryptText = function (text,algorithum,password) {
    var cipher = crypto.createCipher(algorithum,password);
    var crypted = cipher.update(text,"utf8",'hex');
    crypted += cipher.final('hex');

    return crypted;
};

Utility.decryptText = function (encryptedText,algorithum,password) {
    var decipher = crypto.createDecipher(algorithum,password);
    var dec = decipher.update(encryptedText,'hex','utf8');
    dec += decipher.final('utf8');

    return dec;
};

Utility.getDeviceTypeFromUserAgent = function (request) {
    var headerValue = request.headers["user-agent"];
    var deviceType = "";

    if(validator.contains(headerValue,"iPhone") || validator.contains(headerValue,"iphone")){
        deviceType = constants.DEVICE_TYPE.IPHONE;
    }else if(validator.contains(headerValue,"Android") || validator.contains(headerValue,"android")){
        deviceType = constants.DEVICE_TYPE.ANDROID;
    }else{
        deviceType = constants.DEVICE_TYPE.WEB;
    }

    return deviceType;
};

Utility.getSourceTypeFromUserAgent = function (request) {
    var headerValue = request.headers["user-agent"];
    var sourceType = "";

    if(validator.contains(headerValue,"iPhone") || validator.contains(headerValue,"Android")){
        sourceType = constants.SOURCE_TYPE.MOBILE;
    } else{
        sourceType  = constants.SOURCE_TYPE.WEB;
    }

    return sourceType ;
};

Utility.removeFile = function(destination){
    var fs = require('fs');

    try{
        fs.unlink(destination, function (err) {
            if (err) throw err;
        });
    }catch(err){
        console.log('Error: '+err);
    }
};

Utility.isNull = function (value) {
    if(value === null || value === undefined){
        return true;
    }

    return false;
};

module.exports = Utility;