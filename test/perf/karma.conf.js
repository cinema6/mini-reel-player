module.exports = function(config) {
    config.set({
        frameworks: ['browserify', 'benchmark'],

        // list of files / patterns to load in the browser
        files: [
            'test/main.js',
            'test/perf/spec/**/*.ut.js'
        ],

        // test results reporter to use
        // possible values: dots || progress || growl
        reporters: ['benchmark', 'junit'],

        browserify: {
            debug: true,
            transform: [
                ['6to5ify', {
                    loose: 'all',
                    modules: 'commonStrict',
                    runtime: true
                }],
                ['partialify']
            ]
        },

        junitReporter: {
            outputFile: 'reports/perf.xml'
        }
    });
};
