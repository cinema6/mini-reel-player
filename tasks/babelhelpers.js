'use strict';

var babel = require('babel-core');

module.exports = function(grunt) {
    grunt.registerMultiTask('babelhelpers', 'Build external babel helpers', function() {
        var options = this.options({
            whitelist: null,
            dest: './external-helpers.js'
        });

        grunt.file.write(options.dest, babel.buildExternalHelpers(options.whitelist));
        grunt.log.ok('Wrote Babel helpers to ' + options.dest + '!');
    });
};
