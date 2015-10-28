'use strict';

var grunt = require('grunt');
var path = require('path');
var builds = require('../../package.json').builds;
var iteration = 0;

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
            preBundleCB: function(browserify) {
                var srcs = grunt.task.current.filesSrc;
                var src = path.resolve(process.cwd(), srcs[iteration++]);
                var basename = path.basename(src);
                var output = grunt.config.process(
                    path.resolve(
                        process.cwd(),
                        './.tmp/<%= settings.distDir %>/<%= _version %>/' + basename + '.map'
                    )
                );

                browserify.plugin('minifyify', { map: basename + '.map', output: output });

                if (iteration === srcs.length) {
                    iteration = 0;
                }
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
