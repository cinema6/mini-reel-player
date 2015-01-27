module.exports = function(grunt) {
    'use strict';

    var path = require('path'),
        _ = require('underscore');

    function loadGlobalConfig(relPath) {
        var configPath = path.join(process.env.HOME, relPath),
            configExists = grunt.file.exists(configPath);

        return configExists ? grunt.file.readJSON(configPath) : {};
    }

    var settings = (function() {
            var json = grunt.file.readJSON('settings.json');

            return _.extend(json, {
                aws: loadGlobalConfig(json.awsJSON)
            });
        }()),
        personal = _.extend({
            browser: 'Google Chrome'
        }, grunt.file.exists('personal.json') ? grunt.file.readJSON('personal.json') : {});

    require('load-grunt-config')(grunt, {
        configPath: path.join(__dirname, 'tasks/options'),
        config: {
            settings: settings,
            personal: personal
        }
    });

    grunt.loadTasks('tasks');

    /*********************************************************************************************
     *
     * SERVER TASKS
     *
     *********************************************************************************************/

    grunt.registerTask('server', 'start a development server', [
        'clean:server',
        'connect:server',
        'copy:server',
        'browserify:server',
        'open:server',
        'watch:livereload'
    ]);

    /*********************************************************************************************
     *
     * TEST TASKS
     *
     *********************************************************************************************/

    grunt.registerTask('test:unit', 'run unit tests', [
        'jshint',
        'karma:unit'
    ]);

    grunt.registerTask('test:perf', 'run performance tests', [
        'karma:perf'
    ]);

    grunt.registerTask('tdd', 'run unit tests whenever files change', [
        'karma:tdd'
    ]);

    /*********************************************************************************************
     *
     * BUILD TASKS
     *
     *********************************************************************************************/

    grunt.registerTask('build', 'build app into distDir', [
        'test:unit',
        'git_describe_tags',
        'clean:build',
        'copy:tmp',
        'htmlmin:tmp',
        'cssmin:tmp',
        'browserify:tmp',
        'closure-compiler:build',
        'copy:build',
        'compress:build',
        'replace:build'
    ]);

    /*********************************************************************************************
     *
     * UPLOAD TASKS
     *
     *********************************************************************************************/

    grunt.registerTask('publish', 'build and upload the application to s3', function(target) {
        grunt.task.run('build');
        grunt.task.run('s3:' + target);
    });
};
