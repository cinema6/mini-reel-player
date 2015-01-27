module.exports = {
    build: {
        js: '.tmp/<%= settings.distDir %>/<%= _version %>/main.js',
        jsOutputFile: '<%= settings.distDir %>/<%= _version %>/main.js',
        options: {
            /* jshint camelcase:false */
            compilation_level: 'ADVANCED_OPTIMIZATIONS',
            language_in: 'ECMASCRIPT5_STRICT'
        }
    }
};
