'use strict';

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
            plugin: [
                ['minifyify', {
                    map: 'main.js.map',
                    output: '.tmp/<%= settings.distDir %>/<%= _version %>/main.js.map'
                }]
            ]
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
            }
        ]
    }
};
