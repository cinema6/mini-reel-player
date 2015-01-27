module.exports = {
    options: {
        mode: 'gzip'
    },
    build: {
        files: [
            {
                cwd: '<%= settings.distDir %>',
                expand: true,
                src: [
                    '**/*.js',
                    '**/*.css'
                ],
                dest: '<%= settings.distDir %>'
            }
        ]
    }
};
