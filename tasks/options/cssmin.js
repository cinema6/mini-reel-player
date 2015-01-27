module.exports = {
    tmp: {
        files: [
            {
                expand: true,
                cwd: 'public',
                src: [
                    '**/*.css'
                ],
                dest: '.tmp/<%= settings.distDir %>/<%= _version %>'
            }
        ]
    }
};
