/**
 * Created by ravimodha on 24/11/16.
 */

var VccResponse = require(appRoot+'/common/vcc_response');
var Logger = require(appRoot+'/common/logger');
var models = require("../models");

module.exports = {
    getList:function (request, response) {
        models.Regions.findAll({
            attributes:[
                "id",
                "name"
            ],
            order:[
                "name"
            ]
        }).then(function (regions) {
            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({region_list: regions})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    }
};