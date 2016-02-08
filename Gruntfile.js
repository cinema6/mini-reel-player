module.exports = function(grunt) {
    'use strict';

    var path = require('path'),
        osType = require('os').type(),
        _ = require('underscore');

    if (osType === 'Darwin'){
        try {
            require('posix').setrlimit('nofile', { soft : 1048 });
        } catch(error) {
        }
    }

    function loadGlobalConfig(relPath) {
        var configPath = path.join(process.env.HOME, relPath),
            configExists = grunt.file.exists(configPath);

        return configExists ? grunt.file.readJSON(configPath) : {};
    }

    var settings = {
        distDir: 'build',
        port: 9000,
        awsJSON: '.aws.json',
        experiencesJSON: 'server/experiences.json',
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
            browser: null
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

    grunt.registerTask('server', 'start a development server', function(exp) {
        var tdd = grunt.option('tdd');
        var mode = grunt.option('mode') || 'full-np';

        var withTests = !!tdd;
        var target = (typeof tdd === 'string') ? tdd : 'app';
        var campId = grunt.option('campaign');
        var params = (function() {
            try {
                return JSON.parse(grunt.option('params'));
            } catch(e) {
                return {};
            }
        }());

        grunt.config.set('browserify.server.files', [
            {
                src: 'src/' + mode + '.js',
                dest: 'server/.build/' + mode + '.js'
            }
        ]);
        grunt.config.set('server.campId', campId);
        grunt.config.set('server.mode', mode);
        grunt.config.set('server.exp', exp || '0');
        grunt.config.set('server.params', params);

        grunt.task.run('babelhelpers:build');

        if (withTests) {
            grunt.task.run('clean:test');
            grunt.task.run('copy:test');
            grunt.task.run('karma:server:foo:' + target);
        }
        grunt.task.run('build');
        grunt.task.run('express:server');
        grunt.task.run('open:server');
        grunt.task.run('watch:livereload' + (withTests ? ('-tdd:' + target) : ''));
    });

    grunt.registerTask('server:docs', 'start a YUIDoc server', [
        'yuidoc:compile',
        'connect:docs',
        'open:docs',
        'watch:docs'
    ]);

    /*********************************************************************************************
     *
     * TEST TASKS
     *
     *********************************************************************************************/

    grunt.registerTask('test:unit', 'run unit tests', function() {
        grunt.task.run('babelhelpers:build');
        grunt.task.run('resetbrowserify');
        grunt.task.run('clean:test');
        grunt.task.run('copy:test');
        grunt.task.run('jshint');

        // Run library code tests if there are any.
        if (grunt.file.expand('test/unit/spec/lib/**/*.ut.js').length > 0) {
            grunt.task.run('karma:unit:lib');
        } else {
            grunt.log.error('There are no tests for library code.');
        }

        grunt.task.run('resetbrowserify');

        // Run application code tests if there are any.
        if (grunt.file.expand('./test/unit/spec/*.ut.js').length > 0) {
            grunt.task.run('karma:unit:app');
        } else {
            grunt.log.error('There are no tests for application code.');
        }
    });

    grunt.registerTask('test:perf', 'run performance tests', [
        'karma:perf'
    ]);

    grunt.registerTask('tdd', 'run unit tests whenever files change', function(_target_) {
        var expand = grunt.file.expand;
        var match = grunt.file.match;

        var target = _target_ || 'app';
        var mainFiles = ['test/main.js', 'test/unit/main.js'];
        var pattern = grunt.option('only') || '**';
        var config = (function() {
            var result = null;
            var configurator = require('./test/unit/karma.' + target + '.conf');
            var config = {
                set: function(options) {
                    result = options;
                }
            };

            configurator(config);

            return result;
        }());
        var exclusions = (config.exclude || []).map(function(file) {
            return '!' + file;
        });
        var patterns = ['**/' + pattern].concat(exclusions);
        var files = mainFiles.concat(match(patterns, expand(config.files))).map(function(file) {
            return { src: file, watched: false };
        });

        grunt.config.set('karma.tdd.files', files);

        grunt.task.run('babelhelpers:build');
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
        'clean:build',
        'babelhelpers:build',
        'cssmin:build',
        'domino_css:build'
    ]);

    grunt.registerTask('build:docs', 'build YUIDocs', [
        'yuidoc:compile'
    ]);

    /*********************************************************************************************
     *
     * UPLOAD TASKS
     *
     *********************************************************************************************/

    grunt.registerTask('publish', 'build and upload the application to s3', function(target) {
        grunt.task.run('build');
        grunt.task.run('build:docs');
        grunt.task.run('s3:' + target);
    });
};
