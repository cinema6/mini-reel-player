module.exports = {
    build: {
        js: '.tmp/<%= settings.distDir %>/<%= _version %>/main.js',
        jsOutputFile: '.tmp/uncompressed/<%= settings.distDir %>/<%= _version %>/main.js',
        options: {
            /* jshint camelcase:false */
            language_in: 'ECMASCRIPT5_STRICT'
        }
    }
};
