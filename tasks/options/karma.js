module.exports = {
    options: {
        configFile: 'test/unit/karma.conf.js'
    },
    unit: {
        options: {
            reporters: ['progress', 'junit'],
            junitReporter: {
                outputFile: 'reports/unit.xml'
            },
            singleRun: true
        }
    },
    tdd: {
        options: {
            autoWatch: true
        }
    },
    server: {
        options: {
            background: true,
            singleRun: false
        }
    },

    perf: {
        options: {
            configFile: 'test/perf/karma.conf.js'
        }
    }
};
