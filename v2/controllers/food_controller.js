/**
 * Created by ravimodha on 18/11/16.
 */

var VccResponse = require(appRoot+'/common/vcc_response');
var Logger = require(appRoot+'/common/logger');
var models = require("../models");

module.exports = {
    getList:function (request, response) {
        models.FoodCategory.findAll({
            attributes:[
                ["id","category_id"],
                ["name","food_category"],
                "order"
            ]
        }).then(function (foodCategories) {
            models.FoodTags.findAll({
                attributes:[
                    ["id","food_id"],
                    "food_name",
                    "food_category"
                ]
            }).then(function (foodTags) {
                var vccResponse = new VccResponse(response);
                vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                    .setResponseBody({food_category: foodCategories,food_tags:foodTags})
                    .send();
            });
        }).catch(function (error) {
            Logger.logDbError(error,request);

            var vccResponse = new VccResponse(response);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    }
};