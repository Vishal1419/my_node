/**
 * Created by ravimodha on 15/08/16.
 */

var winston = require('winston');

var pxmDevelopment = {
    db: {
        "username": "vcc",
        "password": "12345678",
        "database": "vcc_vcc",
        "host": "192.168.100.204",
        "dialect": "mysql",
        "port":3306,
        "define": {
            "timestamps": false
        }
    },
    server:{
        // ip:"172.20.10.2",
        //port:8080
        ip:"192.168.101.35",
        //  ip:"192.168.101.18",
        port:8888
    },
    authClient:{
        clientId: "727f7933ce4d7c87533ed118805fa1ad",
        clientSecret: "f8458bf5047f7f0a8974159920c51948"
    },
    adminAuthClient:{
        clientId:"5c08e8f61ebe40afa84af0c9b492006c",
        clientSecret:"f72632b6218e822f74f0eea0d4324dbd"
    },
    mailConfig:{
        host:"email-smtp.us-east-1.amazonaws.com",
        port:465,
        from: "staff@vincompass.com",
        username:"AKIAJAD53MCBMOR6IFBA",
        password:"AnMrA582/OZFCxWHjMZAcClx1zgSU9rvp9/7wbWw0O6H",
        secure:true
    },
    logger:{
        transports:[
            new (winston.transports.Console)({
                colorize:true
            }),
            new (winston.transports.File)({
                name:'db-error-file',
                colorize:true,
                filename:'vcc-db-error-file.log',
                maxsize:2097152,
                level: 'error'
            })
        ]
    },
    memchace:{
        server:[
            "192.168.100.204:11211"
        ]
    },
    AWS_APP_ARN:{
        // USES SANDBOX DEVELOPMENT FOR IOS
        IOS:"arn:aws:sns:us-west-1:180288998406:app/APNS_SANDBOX/vincompass-ios-sandbox-dev-2015",
        ANDROID:"arn:aws:sns:us-west-1:180288998406:app/GCM/vincompass-android-sandbox-dev-2015"
    },
    RE_URL : "https://managestaging.vincompass.com:8084/vincompass/getResult"
};

var pxmProducation = {
    db: {
        "username": "vcc",
        "password": "12345678",
        "database": "vcc_vcc",
        "host": "192.168.100.204",
        "dialect": "mysql",
        "port":3306,
        "define": {
            "timestamps": false
        }
    },
    server:{
        ip:"192.168.100.204",
        port:8080
    },
    authClient:{
        clientId: "727f7933ce4d7c87533ed118805fa1ad",
        clientSecret: "f8458bf5047f7f0a8974159920c51948"
    },
    adminAuthClient:{
        clientId:"5c08e8f61ebe40afa84af0c9b492006c",
        clientSecret:"f72632b6218e822f74f0eea0d4324dbd"
    },
    mailConfig:{
        host:"email-smtp.us-east-1.amazonaws.com",
        port:465,
        from: "staff@vincompass.com",
        username:"AKIAJAD53MCBMOR6IFBA",
        password:"AnMrA582/OZFCxWHjMZAcClx1zgSU9rvp9/7wbWw0O6H",
        secure:true
    },
    logger:{
        transports:[
            new (winston.transports.File)({
                name:'error-file',
                colorize:true,
                filename:'vcc-error-file.log',
                maxsize:2097152,
                level: 'error'
            })
        ]
    },
    memchace:{
        server:[
            "192.168.100.204:11211"
        ]
    },
    AWS_APP_ARN:{
        // USES SANDBOX PRODUCATION FOR IOS
        IOS:"arn:aws:sns:us-west-1:180288998406:app/APNS/vincompass-ios-sandbox-prod-2015",
        ANDROID:"arn:aws:sns:us-west-1:180288998406:app/GCM/vincompass-android-sandbox-dev-2015"
    },
    RE_URL : "https://staging.vincompass.com:8082/vincompass/getResult"
};

var vccStaging = {
    db: {
        "username": "vcc",
        "password": "12345678",
        "database": "vcc_vcc",
        "host": "192.168.100.204",
        "dialect": "mysql",
        "port":3306,
        "define": {
            "timestamps": false
        }
    },
    server:{
        ip:"*",
        port:8080
    },
    authClient:{
        clientId: "727f7933ce4d7c87533ed118805fa1ad",
        clientSecret: "f8458bf5047f7f0a8974159920c51948"
    },
    adminAuthClient:{
        clientId:"5c08e8f61ebe40afa84af0c9b492006c",
        clientSecret:"f72632b6218e822f74f0eea0d4324dbd"
    },
    mailConfig:{
        host:"email-smtp.us-east-1.amazonaws.com",
        port:465,
        from: "staff@vincompass.com",
        username:"AKIAJAD53MCBMOR6IFBA",
        password:"AnMrA582/OZFCxWHjMZAcClx1zgSU9rvp9/7wbWw0O6H",
        secure:true
    },
    logger:{
        transports:[
            new (winston.transports.File)({
                name:'error-file',
                colorize:true,
                filename:'vcc-error-file.log',
                maxsize:2097152,
                level: 'error'
            })
        ]
    },
    memchace:{
        server:[
            '172.16.0.31:11211',
            '172.16.0.31:11211'
        ]
    },
    AWS_APP_ARN:{
        // USES BETA PRODUCATION FOR IOS
        IOS:"arn:aws:sns:us-west-1:180288998406:app/APNS/vincompass-ios-beta-prod-2016",
        ANDROID:"arn:aws:sns:us-west-1:180288998406:app/GCM/vincompass-android-sandbox-dev-2015"
    },
    RE_URL : "https://dev.vincompass.com:8084/vincompass/getResult"
};

var vccProducation = {
    db: {
        "username": "vcc",
        "password": "12345678",
        "database": "vcc_vcc",
        "host": "192.168.100.204",
        "dialect": "mysql",
        "port":3306,
        "define": {
            "timestamps": false
        }
    },
    server:{
        ip:"*",
        port:8080
    },
    authClient:{
        clientId: "727f7933ce4d7c87533ed118805fa1ad",
        clientSecret: "f8458bf5047f7f0a8974159920c51948"
    },
    adminAuthClient:{
        clientId:"5c08e8f61ebe40afa84af0c9b492006c",
        clientSecret:"f72632b6218e822f74f0eea0d4324dbd"
    },
    mailConfig:{
        host:"email-smtp.us-east-1.amazonaws.com",
        port:465,
        from: "staff@vincompass.com",
        username:"AKIAJAD53MCBMOR6IFBA",
        password:"AnMrA582/OZFCxWHjMZAcClx1zgSU9rvp9/7wbWw0O6H",
        secure:true
    },
    logger:{
        transports:[
            new (winston.transports.File)({
                name:'error-file',
                colorize:true,
                filename:'vcc-error-file.log',
                maxsize:2097152,
                level: 'error'
            })
        ]
    },
    memchace:{
        server:[
            "192.168.100.204:11211"
        ]
    },
    AWS_APP_ARN:{
        // USES PRODUCATION FOR IOS
        IOS:"arn:aws:sns:us-west-1:180288998406:app/APNS/vincompass-ios-prod-2015",
        ANDROID:"arn:aws:sns:us-west-1:180288998406:app/GCM/vincompass-android-sandbox-dev-2015"
    },
    RE_URL : "https://staging.vincompass.com:8082/vincompass/getResult"
};

module.exports.ENV_CONFIG = pxmDevelopment;