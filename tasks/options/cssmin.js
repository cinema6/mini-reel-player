'use strict';

var builds = require('../../package.json').builds;

module.exports = {
    build: {
        files: [
            {
                expand: true,
                cwd: 'public',
                src: builds.map(function(build) {
                    return 'css/' + build + '*.css';
                }),
                dest: '<%= settings.distDir %>'
            }
        ]
    }
};
