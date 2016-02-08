module.exports = {
    options: {
        livereload: {
            liveCSS: false
        }
    },
    livereload: {
        files: [
            'public/**/*.html',
            'public/**/*.css',
            'public/**/*.{png,jpg,jpeg,gif,webp,svg}',
            'src/**/*.*',
            'lib/**/*.*'
        ],
        tasks: ['build']
    },
    'livereload-tdd': {
        files: [
            'public/**/*.html',
            'public/**/*.css',
            'public/**/*.{png,jpg,jpeg,gif,webp,svg}',
            'src/**/*.*',
            'lib/**/*.*',
            'test/unit/**/*.js'
        ],
        tasks: ['build', 'karma:server:run:<%= grunt.task.current.args[1] %>']

    },
    docs: {
        files: [
            'src/**/*.js',
            'lib/**/*.js'
        ],
        tasks: ['yuidoc:compile']
    }
};
