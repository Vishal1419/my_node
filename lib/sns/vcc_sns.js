const AWS = require('aws-sdk');
const constants = require(appRoot+'/common/constants');

AWS.config.update({
  accessKeyId: constants.AWS.ACCESS_KEY,
  secretAccessKey: constants.AWS.SECRET_ACCESS_KEY,
  region: constants.AWS.REGION
});

function VccSns(){

}

VccSns.prototype.createEndPointForApp = function(platformAppArn,deviceToken,uniqueIdentifier,callback){
  var sns = new AWS.SNS();

  sns.createPlatformEndpoint({
    PlatformApplicationArn:platformAppArn,
    Token:deviceToken,
    CustomUserData:uniqueIdentifier
  },function(err,data){
    callback(err,data);
  });
};

VccSns.prototype.setEndPointAttribute = function (attributes, endPointArn, callback) {
    var sns = new AWS.SNS();

    sns.setEndpointAttributes({
        Attributes:attributes,
        EndpointArn:endPointArn
    },function (error, data) {
       console.log("Data : "+data);
       callback(error,data);
    });
};

VccSns.prototype.publish = function (params, callback) {
    var sns = new AWS.SNS();
    
    sns.publish(params,function (error, data) {
        callback(error,data);
    })
};

module.exports = VccSns;

