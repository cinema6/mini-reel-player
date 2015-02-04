var pkg = require('../../package.json');

module.exports = function(config) {
    // Karma configuration
    'use strict';

    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '../..',

        frameworks: ['browserify', 'jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'test/main.js',
            'test/unit/spec/**/*.ut.js'
        ],

        preprocessors: {
            'src/**/*.js': ['jshint', 'browserify'],
            'lib/**/*.js': ['jshint', 'browserify'],
            'test/**/*.js': ['jshint', 'browserify']
        },

        // list of files to exclude
        exclude: [pkg.main],

        // test results reporter to use
        // possible values: dots || progress || growl
        reporters: ['progress'],

        // web server port
        port: 8000,

        // cli runner port
        runnerPort: 9100,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 5000,

        browserify: {
            debug: true,
            transform: [
                ['6to5ify', {
                    loose: 'all',
                    modules: 'commonStrict'
                }],
                ['partialify']
            ]
        }
    });
};
