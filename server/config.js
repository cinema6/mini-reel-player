var config = require('../build.json');
var assign = require('lodash/object/assign');
var clone = require('lodash/lang/cloneDeep');
var resolvePath = require('path').resolve;

module.exports = assign(clone(config), {
    plugins: {
        js: [require.resolve('./watchify.js')]
    },

    watchify: {
        endpoint: '/__watchify__',
        buildDir: resolvePath(__dirname, './.build')
    }
});
