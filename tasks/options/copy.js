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
                cwd: 'lib',
                src: [
                    '**/*.js'
                ],
                dest: '.tmp/lib'
            },
            {
                expand: true,
                cwd: 'ext',
                src: [
                    '**/*.js'
                ],
                dest: '.tmp/ext'
            },
            {
                expand: true,
                cwd: 'public',
                src: [
                    '**/*.{png,jpg,jpeg,gif,webp,svg,swf}'
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
                    '**'
                ],
                dest: '<%= settings.distDir %>'
            }
        ]
    },
    test: {
        files: [
            {
                expand: true,
                cwd: 'lib',
                src: [
                    '**/*.js'
                ],
                dest: '.tmp/lib-real'
            }
        ]
    }
};
