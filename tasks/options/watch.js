var grunt = require('grunt');

module.exports = {
    livereload: {
        options: {
            livereload: true
        },
        files: [
            'public/**/*.html',
            'public/**/*.{png,jpg,jpeg,gif,webp,svg}',
            'src/**/*.*',
            'lib/**/*.*'
        ],
        tasks: []
    },
    'livereload-tdd': {
        options: {
            livereload: true
        },
        files: [
            'public/**/*.html',
            'public/**/*.{png,jpg,jpeg,gif,webp,svg}',
            'src/**/*.*',
            'lib/**/*.*',
            'test/unit/**/*.js'
        ],
        tasks: ['karma:server:run:<%= grunt.task.current.args[1] %>']

    },
    domino: {
        options: {
            livereload: true
        },
        files: [
            'public/**/*.css'
        ],
        tasks: ['build']
    },
    collateral: {
        options: {
            livereload: true
        },
        files: [
            'server/mothership/collateral/branding/**'
        ],
        tasks: ['build-collateral']
    },
    docs: {
        options: {
            livereload: true
        },
        files: [
            'src/**/*.js',
            'lib/**/*.js'
        ],
        tasks: ['yuidoc:compile']
    }
};
