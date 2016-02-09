module.exports = {
    build: {
        files: [
            {
                expand: true,
                cwd: '<%= settings.distDir %>',
                src: '**/*.css',
                dest: '<%= settings.distDir %>/',
                extDot: 'last',
                ext: '.css.domino.js'
            }
        ]
    }
};
