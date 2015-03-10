module.exports = function(config) {
    config.set({
        frameworks: ['browserify', 'jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'test/main.js',
            'test/unit/spec/lib/**/*.ut.js'
        ],

        // test results reporter to use
        // possible values: dots || progress || growl
        reporters: ['progress'],

        browserify: {
            debug: true,
            transform: [
                ['babelify', require('../../tasks/resources/babel.config.js')],
                ['partialify']
            ]
        }
    });
};
