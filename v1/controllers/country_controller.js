/**
 * Created by ravimodha on 02/01/17.
 */

const VccResponse = require(appRoot+'/common/vcc_response');
const Logger = require(appRoot+'/common/logger');

// const models = require("../models");
const vincompassController = require('../controllers/vincompass_controller');

module.exports = {
    getList:function (request, response) {
        // models.Countries.findAll({
        //     attributes:[
        //         "country",
        //         "display_order"
        //     ],
        //     order:[
        //         "display_order"
        //     ]
        // }).then(function (countryList) {
        //     var vccResponse = new VccResponse(response);
        //     vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
        //         .setResponseBody({countries: countryList})
        //         .send();
        // }).catch(function (error) {
        //     Logger.logDbError(error,request);
        //
        //     var vccResponse = new VccResponse(response);
        //     vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
        //         .send();
        // })

        var vccResponse = new VccResponse(response);
        vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
            .setResponseBody({countries: vincompassController.getCountryList()})
            .send();
    }
};