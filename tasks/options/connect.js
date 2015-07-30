var c6embed = require('../resources/c6embed-server');
var grunt = require('grunt');

module.exports = {
    options: {
        hostname: '0.0.0.0'
    },
    server: {
        options: {
            port: '<%= settings.port %>',
            base: 'server',
            livereload: true,
            middleware: function(connect, options, middleware) {
                'use strict';

                return [
                    c6embed({
                        playerFile: '.build/index.html',
                        urlRoot: 'mothership',

                        experiences: [grunt.config.get('server.exp')],
                        index: 0
                    })
                ].concat(middleware);
            }
        }
    },
    docs: {
        options: {
            port: 8000,
            base: 'docs',
            livereload: true
        }
    }
};
