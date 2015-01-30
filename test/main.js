require('es6-promise').polyfill();
if (!('WeakMap' in global)) {
    global.WeakMap = require('weakmap');
}
require('whatwg-fetch');
require('raf.js');
