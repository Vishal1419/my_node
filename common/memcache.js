/**
 * Created by ravimodha on 21/01/17.
 */

var MemcachePlus = require('memcache-plus');

const config    = require(appRoot+"/app_config.js");

var sharedInstanceObj;

function Memcache() {
    this.memcachePlus = null;
}

Memcache.sharedInstance = function () {
    if (!sharedInstanceObj) {
        sharedInstanceObj = new Memcache();

        sharedInstanceObj.memcachePlus = new MemcachePlus(config.ENV_CONFIG.memchace.server);
    }
    return sharedInstanceObj;
};

Memcache.prototype.clear = function () {
    sharedInstanceObj = null;
};

Memcache.prototype.getMemcachePlus = function() {
    return this.memcachePlus;
};

module.exports = Memcache;