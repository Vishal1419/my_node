/**
 * Created by ravimodha on 31/05/17.
 */

const Utility = require(global.appRoot+'/common/utility');

function AndroidPayload(title,options,customData){
    this.data = {};
    this.payload = {};
    this.data.message = title;

    this.payload.GCM = {
        data:this.data
    };

    if (Utility.isNull(customData) === false){

        if(Utility.isNull(options) === false){
            if (Utility.isNull(options.badge) === false){
                customData.badge = options.badge;
            }
        }

        this.payload.GCM.data.body = customData;
    }
}

AndroidPayload.prototype.getPayloadInStr = function () {
    var payload = this.payload;
    payload.GCM = JSON.stringify(payload.GCM);

    return JSON.stringify(payload);
};

module.exports = AndroidPayload;