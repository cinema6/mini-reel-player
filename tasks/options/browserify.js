module.exports = {
    options: {
        transform: [
            ['babelify', {
                loose: 'all'
            }],
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
