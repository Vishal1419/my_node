/**
 * Created by ravimodha on 07/01/17.
 */

const VccResponse = require(appRoot+'/common/vcc_response');
const Logger = require(appRoot+'/common/logger');

// const models = require("../models");
const vincompassController = require('../controllers/vincompass_controller');

module.exports = {
    getList:function (request, response) {
        // models.Grapes.findAll({
        //     attributes:[
        //         ["id","grape_id"],
        //         "grape"
        //     ],
        //     order:[
        //         "grape"
        //     ]
        // }).then(function (grapeList) {
        //     var vccResponse = new VccResponse(response);
        //     vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
        //         .setResponseBody({grape_list: grapeList})
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
            .setResponseBody({grape_list: vincompassController.getGrapeList()})
            .send();
    }
};