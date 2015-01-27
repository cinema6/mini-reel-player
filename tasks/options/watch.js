(function() {
    'use strict';

    module.exports = {
        livereload: {
            files: [
                'public/**/*.html',
                'public/**/*.css',
                'public/**/*.{png,jpg,jpeg,gif,webp,svg}',
                'server/.build/**/*.js'
            ],
            options: {
                livereload: true
            },
            tasks: ['jshint', 'copy:server']
        }
    };
})();
