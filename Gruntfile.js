module.exports = function(grunt) {
    'use strict';

    var path = require('path'),
        _ = require('underscore');

    function loadGlobalConfig(relPath) {
        var configPath = path.join(process.env.HOME, relPath),
            configExists = grunt.file.exists(configPath);

        return configExists ? grunt.file.readJSON(configPath) : {};
    }

    var settings = {
        distDir: 'build',
        port: 9000,
        awsJSON: '.aws.json',
        s3: {
            staging: {
                bucket: 'com.cinema6.staging',
                app: 'apps/<%= package.name %>/'
            },
            production: {
                bucket: 'com.cinema6.portal',
                app: 'apps/<%= package.name %>/'
            }
        }
    },
        personal = _.extend({
            browser: 'Google Chrome'
        }, grunt.file.exists('personal.json') ? grunt.file.readJSON('personal.json') : {});

    require('load-grunt-config')(grunt, {
        configPath: path.join(__dirname, 'tasks/options'),
        config: {
            settings: _.extend(settings, {
                aws: loadGlobalConfig(settings.awsJSON)
            }),
            personal: personal
        }
    });

    grunt.loadTasks('tasks');

    /*********************************************************************************************
     *
     * SERVER TASKS
     *
     *********************************************************************************************/

    grunt.registerTask('server', 'start a development server', function(config) {
        var withTests = config === 'tdd';

        if (withTests) {
            grunt.task.run('clean:test');
            grunt.task.run('copy:test');
            grunt.task.run('karma:server');
        }
        grunt.task.run('clean:server');
        grunt.task.run('connect:server');
        grunt.task.run('copy:server');
        grunt.task.run('browserify:server');
        grunt.task.run('open:server');
        grunt.task.run('watch:livereload' + (withTests ? '-tdd' : ''));
    });

    /*********************************************************************************************
     *
     * TEST TASKS
     *
     *********************************************************************************************/

    grunt.registerTask('test:unit', 'run unit tests', [
        'clean:test',
        'copy:test',
        'jshint',
        'karma:unit'
    ]);

    grunt.registerTask('test:perf', 'run performance tests', [
        'karma:perf'
    ]);

    grunt.registerTask('tdd', 'run unit tests whenever files change', function(target) {
        target = target || 'app';

        grunt.task.run('clean:test');
        grunt.task.run('copy:test');
        grunt.task.run('karma:tdd:' + target);
    });

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
