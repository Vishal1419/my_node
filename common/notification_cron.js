/**
 * Created by ravimodha on 31/05/17.
 */

const moment = require('moment');
const CronJob = require('cron').CronJob;
const notificationController = require("../v2/controllers/notification_controller");

var sharedInstanceObj;

function NotificationCron() {
    this.notificationCronJob = null;
}

NotificationCron.sharedInstance = function () {
    if (!sharedInstanceObj) {
        sharedInstanceObj = new NotificationCron();
    }
    return sharedInstanceObj;
};

NotificationCron.prototype.startNotificationCron = function () {
    this.notificationCronJob = new CronJob({
        cronTime: '* * * * *',
        onTick: function() {
            console.log(moment().utc().format("YYYY-MM-DD HH:mm"));
            notificationController.sendNotification();
        },
        start: false
    });
    this.notificationCronJob.start();
};

module.exports = NotificationCron;