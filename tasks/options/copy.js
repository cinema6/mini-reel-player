module.exports = {
    tmp: {
        files: [
            {
                expand: true,
                cwd: 'src',
                src: [
                    '**/*.js'
                ],
                dest: '.tmp/src'
            },
            {
                expand: true,
                cwd: 'public',
                src: [
                    '**/*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                dest: '.tmp/<%= settings.distDir %>/<%= _version %>'
            }
        ]
    },
    build: {
        files: [
            {
                expand: true,
                cwd: '.tmp/<%= settings.distDir %>',
                src: [
                    '**',
                    '!*.js'
                ],
                dest: '<%= settings.distDir %>'
            }
        ]
    },
    server: {
        files: [
            {
                expand: true,
                cwd: 'public',
                src: [
                    '**'
                ],
                dest: 'server/.build'
            }
        ]
    }
};
