import urlParser from './services/url_parser.js';
import {
    reduce
} from '../lib/utils.js';

/*jshint scripturl:true*/
const c6 = global.c6 || {};
const $location = (() => {
    try {
        return urlParser.parse(global.parent.location.href);
    } catch (e) {
        return urlParser.parse(global.location.href);
    }
}());
const GUID_KEY = '__c6_guid__';

const POSSIBILITES = '0123456789abcdefghijklmnopqrstuvwxyz';
const NUM_OF_POSSIBILITES = POSSIBILITES.length;
function generateId(length) {
    return reduce(new Array(length), result => {
        return result + POSSIBILITES[Math.floor(Math.random() * NUM_OF_POSSIBILITES)];
    }, '');
}

const storage = {
    get(key) {
        try { return localStorage.getItem(key); } catch(e) { return undefined; }
    },

    set(key, value) {
        try { return localStorage.setItem(key, value); } catch(e) { return undefined; }
    }
};

class Environment {
    constructor() {
        this.debug = !!c6.kDebug;
        this.secure = $location.protocol === 'https';
        this.apiRoot = c6.kEnvUrlRoot || '//portal.cinema6.com';
        this.mode = c6.kMode;

        this.protocol = ($location.protocol === 'javascript' ?  'http' : $location.protocol) + ':';
        this.hostname = $location.hostname;
        this.href = $location.href;
        this.origin = $location.origin;
        this.ancestorOrigins = (function() {
            return window.location.ancestorOrigins ?
                Array.prototype.slice.call(window.location.ancestorOrigins) :
                [this.origin];
        }.call(this));

        this.initTime = c6.kStartTime;
        this.guid = (() => {
            const guid = storage.get(GUID_KEY) || generateId(32);
            storage.set(GUID_KEY, guid);
            return guid;
        }());
    }
}

export default new Environment();
