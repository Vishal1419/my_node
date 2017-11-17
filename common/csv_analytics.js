/**
 * Created by ravimodha on 26/04/17.
 */

const fs = require('fs');
const path = require('path');
const moment = require('moment');
const papaParser = require('papaparse');

const constants = require(global.appRoot+'/common/constants');

var sharedInstanceObj;

function CsvAnalytics() {

}

CsvAnalytics.sharedInstance = function () {
    if (!sharedInstanceObj) {
        sharedInstanceObj = new CsvAnalytics();
    }
    return sharedInstanceObj;
};

CsvAnalytics.prototype.wineWizardAnalytics = function (data) {
    var fileExists = false;
    var fileName = moment().format("MM_DD_YYYY") + ".csv";
    var filePath = path.join(appRoot,"analytics","wine_wizard",fileName);


    if(fs.existsSync(filePath)){
        fileExists = true;
    }

    if(fileExists === false){
        var fd = fs.openSync(filePath, 'w');
        fs.closeSync(fs.openSync(filePath, 'w'));
    }

    var csvData = papaParser.unparse(data,{
        quotes: true,
        quoteChar: '"',
        delimiter: ",",
        header: !fileExists,
        newline: "\n"
    });

    fs.appendFile(filePath,csvData+"\r\n",function (error) {
        if(error){
            console.log(error);
        }
    })
};

CsvAnalytics.prototype.writeToFile = function (data,type) {
    var fileExists = false;
    var dirName = "";

    if(type === constants.ANALYTIC_TYPES.WINE_WIZARD){
        dirName = "wine_wizard";
    }else if(type === constants.ANALYTIC_TYPES.SELECTED_MAP_PINS){
        dirName = "selected_map_pins";
    }else if(type === constants.ANALYTIC_TYPES.WINE_ARCHIVE){
        dirName = "wine_archive";
    }else if(type === constants.ANALYTIC_TYPES.RESTAURANT_ARCHIVE){
        dirName = "restaurant_archive";
    }else if(type === constants.ANALYTIC_TYPES.DATA_FACTORY){
        dirName = "data_factory";
    }else if(type === constants.ANALYTIC_TYPES.RESTAURANT_LIST){
        dirName = "restaurant_list";
    }else if(type === constants.ANALYTIC_TYPES.FOOD_WINE_PAIRING){
        dirName = "food_wine_pairing";
    }else if(type === constants.ANALYTIC_TYPES.WINE_SELECTION_NOTIFICATION){
        dirName = "wine_selection_notification";
    }


    var fileName = moment().format("MM_DD_YYYY") + ".csv";
    var filePath = path.join(appRoot,"analytics",dirName,fileName);


    if(fs.existsSync(filePath)){
        fileExists = true;
    }

    if(fileExists === false){
        var fd = fs.openSync(filePath, 'w');
        fs.closeSync(fs.openSync(filePath, 'w'));
    }

    var csvData = papaParser.unparse(data,{
        quotes: true,
        quoteChar: '"',
        delimiter: ",",
        header: !fileExists,
        newline: "\n"
    });

    fs.appendFile(filePath,csvData+"\r\n",function (error) {
        if(error){
            console.log(error);
        }
    })
};


module.exports = CsvAnalytics;