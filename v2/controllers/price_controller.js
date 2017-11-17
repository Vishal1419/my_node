/**
 * Created by ravimodha on 19/12/16.
 */

var VccResponse = require(appRoot+'/common/vcc_response');
var Logger = require(appRoot+'/common/logger');
var models = require("../models");

module.exports = {
    getList:function (request, response) {
        models.PriceRange.findAll({
            attributes:[
                ["id","price_id"],
                "value",
                "from_price",
                "to_price"
            ],
            order:[
                "from_price"
            ],
            where:{
                active:1
            }
        }).then(function (priceList) {
            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({price_list: priceList})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        })
    }
};