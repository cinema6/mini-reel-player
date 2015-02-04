module.exports = {
    options: {
        transform: [
            ['6to5ify', {
                loose: 'all',
                runtime: true
            }],
            ['partialify']
        ]
    },
    tmp: {
        files: [
            {
                cwd: '.tmp',
                src: '<%= package.main %>',
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
