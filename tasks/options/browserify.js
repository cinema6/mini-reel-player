module.exports = {
    options: {
        transform: [
            ['babelify', require('../../tasks/resources/babel.config.js')],
            ['partialify']
        ]
    },
    tmp: {
        files: [
            {
                src: '.tmp/<%= package.main %>',
                dest: '.tmp/<%= settings.distDir %>/<%= _version %>/main.js'
            }
        ]
    },
    server: {
        options: {
            watch: true,
            keepAlive: false,
            browserifyOptions: {
                debug: true
            }
        },
        files: [
            {
                src: '<%= package.main %>',
                dest: 'server/.build/main.js'
            }
        ]
    }
};
