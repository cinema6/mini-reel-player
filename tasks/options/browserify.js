'use strict';

var builds = require('../../package.json').builds;
var buildConfig = require('../../build.json');

module.exports = {
    options: {
        browserifyOptions: {
            debug: true
        },
        transform: buildConfig.browserify.transforms
    },
    tmp: {
        options: {
            browserifyOptions: {
                debug: false
            },
            configure: function(browserify) {
                browserify.transform('uglifyify', { global: true });
            }
        },
        files: builds.map(function(type) {
            return {
                src: '.tmp/src/' + type + '.js',
                dest: '.tmp/uncompressed/<%= settings.distDir %>/<%= _version %>/' + type + '.js'
            };
        })
    },
    server: {
        options: {
            watch: true,
            keepAlive: false
        }
        // files are set via CLI options in Gruntfile.js
    }
};
