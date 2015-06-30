module.exports = {
    options: {
        hostname: '0.0.0.0'
    },
    server: {
        options: {
            port: '<%= settings.port %>',
            base: 'server',
            livereload: true
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
