'use strict';

var resolvePath = require('path').resolve;

module.exports = function(grunt) {
    grunt.registerMultiTask('babelhelpers', 'Build external babel helpers', function() {
        var options = this.options({
            dest: './external-helpers.js'
        });
        var done = this.async();

        grunt.util.spawn({
            cmd: resolvePath(process.cwd(), './node_modules/.bin/babel-external-helpers')
        }, function(error, result, code) {
            if (error || code !== 0) { done(false); }

            grunt.file.write(options.dest, result.toString());
            grunt.log.ok('Wrote Babel helpers to ' + options.dest + '!');
            done();
        });
    });
};
