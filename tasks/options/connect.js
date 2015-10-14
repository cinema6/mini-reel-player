var httpMock = require('http-mock');

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
                    httpMock({
                        '/': 'server/index.js',

                        '@verbosity': 0
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
