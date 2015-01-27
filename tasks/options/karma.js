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

    perf: {
        options: {
            configFile: 'test/perf/karma.conf.js'
        }
    }
};
