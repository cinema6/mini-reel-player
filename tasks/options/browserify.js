'use strict';

var grunt = require('grunt');
var path = require('path');
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
        files: [
            {
                src: '.tmp/<%= package.scripts.mobile %>',
                dest: '.tmp/uncompressed/<%= settings.distDir %>/<%= _version %>/mobile.js'
            },
            {
                src: '.tmp/<%= package.scripts.full %>',
                dest: '.tmp/uncompressed/<%= settings.distDir %>/<%= _version %>/full.js'
            },
            {
                src: '.tmp/<%= grunt.config("package.scripts.lightbox-playlist") %>',
                dest: '.tmp/uncompressed/<%= settings.distDir %>/' +
                    '<%= _version %>/lightbox-playlist.js'
            },
            {
                src: '.tmp/<%= package.scripts.lightbox %>',
                dest: '.tmp/uncompressed/<%= settings.distDir %>/<%= _version %>/lightbox.js'
            },
            {
                src: '.tmp/<%= package.scripts.light %>',
                dest: '.tmp/uncompressed/<%= settings.distDir %>/<%= _version %>/light.js'
            },
            {
                src: '.tmp/<%= package.scripts.solo %>',
                dest: '.tmp/uncompressed/<%= settings.distDir %>/<%= _version %>/solo.js'
            }
        ]
    },
    server: {
        options: {
            watch: true,
            keepAlive: false
        },
        files: [
            {
                src: '<%= package.scripts.mobile %>',
                dest: 'server/.build/mobile.js'
            },
            {
                src: '<%= package.scripts.full %>',
                dest: 'server/.build/full.js'
            },
            {
                src: '<%= grunt.config("package.scripts.lightbox-playlist") %>',
                dest: 'server/.build/lightbox-playlist.js'
            },
            {
                src: '<%= package.scripts.lightbox %>',
                dest: 'server/.build/lightbox.js'
            },
            {
                src: '<%= package.scripts.light %>',
                dest: 'server/.build/light.js'
            },
            {
                src: '<%= package.scripts.solo %>',
                dest: 'server/.build/solo.js'
            }
        ]
    }
};
