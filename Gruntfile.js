var request = require('request-promise');
var BluebirdPromise = require('bluebird').Promise;
var url = require('url');

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

    grunt.registerTask('server', 'start a development server', function(_index_) {
        var done = this.async();
        var tdd = grunt.option('tdd');
        var modeOverride = grunt.option('mode');

        var withTests = !!tdd;
        var target = (typeof tdd === 'string') ? tdd : 'app';
        var index = _index_ === undefined ?
            0 : (isNaN(parseInt(_index_)) ? undefined : parseInt(_index_));
        var expId = index === undefined ? _index_ : undefined;
        var campId = grunt.option('campaign');
        var params = (function() {
            try {
                return JSON.parse(grunt.option('params'));
            } catch(e) {
                return {};
            }
        }());

        function getMockExperience(index) {
            var experiences = grunt.file.readJSON(grunt.config('settings.experiencesJSON'));

            return BluebirdPromise.resolve(experiences[index]);
        }

        function getStagingExperience(expId, campId) {
            return request.get({
                uri: url.format({
                    protocol: 'http',
                    hostname: 'staging.cinema6.com',
                    pathname: 'api/public/content/experience/' + expId,
                    query: {
                        preview: true,
                        campaign: campId
                    }
                }),
                json: true
            });
        }

        function getExperience(index, expId, campId) {
            return (index ? getMockExperience(index) : getStagingExperience(expId, campId))
                .then(function setMode(experience) {
                    if (modeOverride) {
                        experience.data.mode = modeOverride;
                    }

                    return experience;
                });
        }

        getExperience(index, expId, campId).then(function runSubTasks(experience) {
            var mode = experience.data.mode;

            grunt.config.set('browserify.server.files', [
                {
                    src: grunt.config('package.scripts.' + mode + '.js'),
                    dest: 'server/.build/' + mode + '.js'
                }
            ]);
            grunt.config.set('server.exp', experience);
            grunt.config.set('server.params', params);

            grunt.task.run('babelhelpers:build');

            if (withTests) {
                grunt.task.run('clean:test');
                grunt.task.run('copy:test');
                grunt.task.run('karma:server:foo:' + target);
            }
            grunt.task.run('clean:server');
            grunt.task.run('connect:server');
            grunt.task.run('copy:server');
            grunt.task.run('browserify:server');
            grunt.task.run('open:server');
            grunt.task.run('watch:livereload' + (withTests ? ('-tdd:' + target) : ''));
        }).catch(done).finally(done);
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
        'test:unit',
        'git_describe_tags',
        'babelhelpers:build',
        'clean:build',
        'copy:tmp',
        'htmlmin:tmp',
        'cssmin:tmp',
        'browserify:tmp',
        'copy:build',
        'compress:build',
        'replace:build'
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
