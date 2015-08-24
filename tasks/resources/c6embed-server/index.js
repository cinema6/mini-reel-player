'use strict';

var Bluebird = require('bluebird');
var path = require('path');
var readFile = Bluebird.promisify(require('fs').readFile);
var Handlebars = require('handlebars');
var inspect = require('util').inspect;

var getTemplate = (function() {
    var promise = null;

    return function getTemplate() {
        return promise || (promise = readFile(path.resolve(__dirname, './assets/index.html'))
            .then(function processHTML(data) {
                return Handlebars.compile(data.toString());
            }));
    };
}());

module.exports = function(config) {
    var params = config.params || {};
    var experience = config.experiences[config.index];
    var playerFolder = path.dirname(config.playerFile);
    var playerFile = path.basename(config.playerFile);
    var urlRoot = config.urlRoot;

    function renderServer(req, res) {
        return getTemplate().then(function sendResponse(template) {
            return res.end(template({
                playerFolder: playerFolder,
                playerFile: playerFile,
                urlRoot: urlRoot,
                experience: JSON.stringify(experience).replace(/<\/script>/g, '<\\/script>'),
                params: JSON.stringify(params)
            }));
        }).catch(function handleError(error) {
            res.statusCode = 500;
            return Promise.reject(res.end(inspect(error)));
        });
    }

    return function c6embedServer(req, res, next) {
        var url = req.url;

        if (url === '/') { return renderServer(req, res); }

        return next();
    };
};
