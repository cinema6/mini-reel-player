'use strict';

var builds = require('../../package.json').builds;

module.exports = {
    options: {
        browserifyOptions: {
            debug: true
        },
        transform: [
            ['babelify', require('../../tasks/resources/babel.config.js')],
            ['partialify']
        ],
        postBundleCB: function(err, src, next) {
            src = 'window.c6.kStartTime = new Date().getTime();' + src;
            next(err, src);
        }
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
