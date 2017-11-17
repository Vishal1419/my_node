/**
 * Created by ravimodha on 31/05/17.
 */

const Utility = require(global.appRoot+'/common/utility');

function IOSPayload(title,options,customData){
    this.aps = {};
    this.payload = {default:title};
    this.aps.alert = title;

    if(Utility.isNull(options) === false){
        if (Utility.isNull(options.badge) === false){
            this.aps.badge = options.badge;
        }

        if (Utility.isNull(options.sound) === false){
            this.aps.sound= options.sound;
        }
    }

    // this.payload.APNS_SANDBOX = {
    //     aps:this.aps
    // };

    this.payload.APNS = {
        aps:this.aps
    };

    if (Utility.isNull(customData) === false){
        this.payload.APNS.body = customData;
        // this.payload.APNS_SANDBOX.body = customData;
    }
}

IOSPayload.prototype.getPayloadInStr = function () {
    var payloadTemp = this.payload;
    // payloadTemp.APNS_SANDBOX = JSON.stringify(payloadTemp.APNS_SANDBOX);
    payloadTemp.APNS= JSON.stringify(payloadTemp.APNS);

    return JSON.stringify(payloadTemp);
};

module.exports = IOSPayload;

