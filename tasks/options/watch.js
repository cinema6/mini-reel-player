module.exports = {
    livereload: {
        files: [
            'public/**/*.html',
            'public/**/*.css',
            'public/**/*.{png,jpg,jpeg,gif,webp,svg}',
            'src/**',
            'lib/**'
        ],
        options: {
            livereload: true
        },
        tasks: ['copy:server', 'jshint']
    },
    'livereload-tdd': {
        files: [
            'public/**/*.html',
            'public/**/*.css',
            'public/**/*.{png,jpg,jpeg,gif,webp,svg}',
            'server/.build/**/*.js',
            'test/unit/**/*.js'
        ],
        options: {
            livereload: true
        },
        tasks: ['copy:server', 'karma:server:run:<%= grunt.task.current.args[1] %>']

    },
    docs: {
        files: [
            'src/**/*.js',
            'lib/**/*.js'
        ],
        options: {
            livereload: true
        },
        tasks: ['yuidoc:compile']
    }
};
