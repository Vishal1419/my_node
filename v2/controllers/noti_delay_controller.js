/**
 * Created by ravimodha on 22/05/17.
 */
const moment = require('moment');
const async = require("async");

const VccResponse = require(appRoot+'/common/vcc_response');
const Utility = require(appRoot+'/common/utility');
const Logger = require(appRoot+'/common/logger');
const models = require("../models");
const constants = require(global.appRoot+'/common/constants');

module.exports = {
    getList:function (request, response) {
        var vccResponse = new VccResponse(response);
        var pageNo = 0;
        var noOfRecords = 0;
        var startIndex = 0;

        if(Utility.isNull(request.params.page_no) === false){
            pageNo = request.params.page_no;
        }

        if(Utility.isNull(request.params.no_of_records) === false){
            noOfRecords = request.params.no_of_records;
        }

        var columns = [
            "noti_delay_group.id AS group_id",
            "noti_delay_group.name",
            "noti_delay_group.delay",
            "noti_delay_group.is_default"
        ];

        var query = "SELECT " +
                columns.join(", ")+ " " +
            "FROM noti_delay_group " +
            "ORDER BY noti_delay_group.id DESC ";

        if(pageNo > 0 && noOfRecords > 0){
            startIndex = (pageNo - 1) * noOfRecords;
            query += "LIMIT :start_index, :offset";
        }

        models.sequelize.query(query,
            {
                replacements:{
                    start_index:startIndex,
                    offset:parseInt(noOfRecords) + 1
                },
                type: models.Sequelize.QueryTypes.SELECT
            }
        ).then(function (groups) {
            var nextPage = false;

            if(pageNo > 0 && noOfRecords > 0){
                if(groups.length === (parseInt(noOfRecords) + 1)){
                    nextPage = true;
                    groups.pop();
                }
            }

            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({group_list: groups,next_page:nextPage})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    },

    create:function (request, response) {
        var vccResponse = new VccResponse(response);
        var addDate = moment.utc();

        models.NotiDelayGroup.create({
            name:request.body.group_name,
            delay:request.body.delay,
            created_date:addDate,
            updated_date:addDate
        }).then(function (group) {
            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                .setResponseBody({group: group})
                .send();
        }).catch(function (error) {
            Logger.logDbError(error,request);

            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        })
    },

    update:function (request, response) {
        var vccResponse = new VccResponse(response);

        models.NotiDelayGroup
            .findById(request.body.group_id)
            .then(function (group) {
                if(group){
                    if(group.is_default === 1){
                        vccResponse.setStatusCode(VccResponse.READ_ONLY_RECORD)
                            .setResponseBody({error: constants.ERROR_MESSAGES.NOTI_DELAY_DEFAULT_GRP})
                            .send();
                    }else{
                        group.update(
                            {
                                name:request.body.group_name,
                                delay:request.body.delay,
                                updated_date:moment.utc()
                            },
                            {
                                fields:[
                                    "name",
                                    "delay",
                                    "updated_date"
                                ]
                            }
                        ).then(function () {
                            vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                                .send();
                        }).catch(function (error) {
                            Logger.logDbError(error,request);

                            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                                .send();
                        });
                    }
                }else{
                    vccResponse.setStatusCode(VccResponse.RECORD_NOT_EXIST)
                        .setResponseBody({error: constants.ERROR_MESSAGES.NOTI_DELAY_GRP_RECORD_NOT_FOUND})
                        .send();
                }
            }).catch(function (error) {
                Logger.logDbError(error,request);
                vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                    .send();
            });
    },
    deleteGroup:function(request,response){
        var vccResponse = new VccResponse(response);

        models.NotiDelayGroup.count({
            where:{
                id:{
                    $in:request.body.group_ids
                },
                is_default:true
            }
        }).then(function (count){
            if(count<=0){
                async.waterfall([
                    function(callback){
                        models.NotiDelayGroup.destroy({
                            where:{
                                id:{
                                    $in:request.body.group_ids
                                }
                            }
                        }).then(function (deletedCount){
                            callback(null,deletedCount);
                        }).catch(function (error){
                            callback(error);
                        });
                    },
                    function(deletedCount,callback){
                        models.Restaurants.update({
                            noti_delay_group_id:constants.DEFAULT_NOTI_DELAY_GROUP_ID
                        },{
                            fields:[
                                "noti_delay_group_id"
                            ],
                            where:{
                                noti_delay_group_id:{
                                    $in:request.body.group_ids
                                }
                            }
                        }).then(function (){
                            callback(null);
                        }).catch(function (error){
                            callback(error);
                        });
                    }
                ],function (error,result){
                    if(error){
                        Logger.logDbError(error,request);
                        vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                            .send();
                    }else{
                        vccResponse.setStatusCode(VccResponse.SUCCESS_CODE)
                            .send();
                    }
                });
            }else{
                vccResponse.setStatusCode(VccResponse.READ_ONLY_RECORD)
                    .setResponseBody({error: "Default group cannot be deleted"})
                    .send();
            }
        }).catch(function(error){
            Logger.logDbError(error,request);
            vccResponse.setStatusCode(VccResponse.DATABASE_ERROR)
                .send();
        });
    }
};
