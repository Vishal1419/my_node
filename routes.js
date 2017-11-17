/**
 * Created by ravimodha on 15/08/16.
 * updated by Vishal Sherathiya on 06/07/2017
 */

var path = require('path');
var fs = require('fs');

module.exports = function (server) {

    const versions = ["v1", "v2", "v3"];

    versions.forEach(function(version){

        var pathToRoutes = path.join(__dirname, version, "routes");

        fs.readdirSync(pathToRoutes).forEach(function(file) {
            require(path.join(pathToRoutes, file))(server);
        });

    }, this);

};
