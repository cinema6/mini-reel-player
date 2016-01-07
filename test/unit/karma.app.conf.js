var buildConfig = require('../../build.json');

module.exports = function(config) {
    process.env.BROWSERIFYSWAP_ENV = 'test:app';

    config.set({
        frameworks: ['browserify', 'jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'test/main.js',
            'test/unit/main.js',
            'test/unit/spec/**/*.ut.js'
        ],

        exclude: [
            'test/unit/spec/lib/**/*.js'
        ],

        // test results reporter to use
        // possible values: dots || progress || growl
        reporters: ['progress'],

        browserify: {
            debug: true,
            transform: buildConfig.browserify.transforms.concat([
                ['browserify-swap']
            ])
        }
    });
};
