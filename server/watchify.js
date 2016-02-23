'use strict';
var request = require('request');
var resolveURL = require('url').resolve;
var resolvePath = require('path').resolve;
var relativePath = require('path').relative;
var pathSep = require('path').sep;

module.exports = function watchifyPlugin(path, file, config, done) {
    var url = resolveURL(config.baseURL, config.watchify.endpoint);

    if (/css\.domino\.js$/.test(path)) {
        return file;
    }

    try {
        return request.get(url, {
            qs: {
                main: path,
                config: JSON.stringify({
                    watchify: config.watchify,
                    browserify: config.browserify
                })
            }
        }).on('error', done);
    } catch(error) {
        done(error);
        return file;
    }
};
