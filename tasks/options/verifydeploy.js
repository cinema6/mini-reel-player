var grunt = require('grunt');

module.exports = {
    options: {
        awsRegion: 'us-east-1',
        protocol: 'http',
        pathname: '/api/players/meta',

        predicate: function checkVersion(meta) {
            'use strict';
            var expected = grunt.option('playerVersion');
            var actual = meta.playerVersion;

            grunt.log.writeln(
                'Checking version. Expected: ' + expected + ', Got: ' + actual + '.'
            );
            return actual === expected;
        }
    },

    staging: {
        options: {
            asgNames: ['player-staging']
        }
    },

    production: {
        options: {
            asgNames: ['player-production']
        }
    }
};
