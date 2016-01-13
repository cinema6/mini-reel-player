'use strict';
var request = require('request');
var resolveURL = require('url').resolve;

module.exports = function watchifyPlugin(path, file, config, done) {
    var url = resolveURL(config.baseURL, config.watchify.endpoint);

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
