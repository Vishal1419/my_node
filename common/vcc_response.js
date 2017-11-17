/**
 * Created by ravimodha on 15/08/16.
 */

function VccResponse(response){
    this.statusCode = 1001;
    this.body = [];
    this.response = response;
}

VccResponse.SUCCESS_CODE = 1000;
VccResponse.UNKNOWN_ERROR= 1001;
VccResponse.DATABASE_ERROR = 1002;
VccResponse.INVALID_USERNAME = 1003;
VccResponse.INVALID_PASSWORD = 1004;
VccResponse.INVALID_ACCESS_TOKEN = 1005;
VccResponse.DETAILS_EXIST = 1006;
VccResponse.RECORD_NOT_EXIST = 1007;
VccResponse.FIELD_REQUIRED = 1008;
VccResponse.TOKEN_EXPIRED = 1009;
VccResponse.TOKEN_ERROR = 1010;
VccResponse.INVALID_DATA_TYPE = 1011;
VccResponse.REQUIRED_FIELD = 1012;
VccResponse.OUT_OF_BOUND = 1013;
VccResponse.INVALID_VALUE = 1014;
VccResponse.RECORD_EXIST = 1015;
VccResponse.LIMIT_REACHED = 1016;
VccResponse.RE_ERROR = 1017;
VccResponse.TOKEN_NOT_FOUND = 1018;
VccResponse.INVALID_USER_TYPE = 1019;
VccResponse.AFFLUENCE_ERROR = 1020;
VccResponse.READ_ONLY_RECORD = 1021;


VccResponse.prototype.setStatusCode = function (statusCode) {
    this.statusCode = statusCode;
    return this;
};

VccResponse.prototype.setResponseBody = function (responseBody) {
    this.body = responseBody;
    return this;
};

VccResponse.prototype.send = function () {
    var responseBody = {
        statusCode: this.statusCode
    };

    for (var key in this.body) {
        responseBody[key] = this.body[key];
    }

    this.response.send(responseBody);
};

module.exports = VccResponse;
