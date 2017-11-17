/**
 * Created by ravimodha on 17/12/16.
 */

var winston = require('winston');

const Utility = require(appRoot+'/common/utility');

var Logger = function () {

};

Logger.dbLogger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            colorize: true
        }),
        new (winston.transports.File)({
            name:'db-error-file',
            colorize:true,
            filename:'vcc-db-error-file.log',
            maxsize:2097152,
            level: 'error'
        })
    ]
});

Logger.notiLogger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            colorize: true
        }),
        new (winston.transports.File)({
            name:'noti-error-file',
            colorize:true,
            filename:'vcc-noti-error-file.log',
            maxsize:2097152,
            level: 'error'
        })
    ]
});

Logger.logDbError = function (error,request) {
    Logger.dbLogger.log(
        error.message,
        {
            request_route:request.route.path,
            request_params:(request.body || request.params),
            query:error.sql
        }
    );
};

Logger.logNotiError = function (error) {
    Logger.notiLogger.log("error",error);
};

module.exports = Logger;
