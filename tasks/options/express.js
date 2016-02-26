module.exports = {
    server: {
        options: {
            port: '<%= settings.port %>',
            script: 'server/index.js',
            args: ['<%= server.mode %>', '<%= server.params %>']
        }
    }
};
