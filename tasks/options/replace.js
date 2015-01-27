module.exports = {
    build: {
        src: ['<%= settings.distDir %>/index.html'],
        dest: '<%= settings.distDir %>/index.html',
        replacements: [
            {
                from: /<base href="?(.+?)"?\/?>/,
                to: function(match, index, text, matches) {
                    'use strict';

                    var grunt = require('grunt');

                    return match.replace(matches[0], grunt.config('_version') + '/');
                }
            }
        ]
    }
};
