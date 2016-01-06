import urlParser from './services/url_parser.js';
import BrowserInfo from 'rc-browser-info';
import {
    reduce
} from '../lib/utils.js';
import resource from './services/resource.js';

/*jshint scripturl:true*/
const c6 = global.c6 || {};
const $location = urlParser.parse(global.location.href);
const $$location = ((() => {
    try {
        return urlParser.parse(global.parent.location.href);
    } catch (e) {
        return $location;
    }
})());
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
        this.browser = new BrowserInfo(window.navigator.userAgent);

        this.debug = !!c6.kDebug;
        this.secure = $$location.protocol === 'https';
        this.apiRoot = c6.kEnvUrlRoot || '//portal.cinema6.com';
        this.params = resource.getSync('options');
        this.mode = this.params.type;

        this.protocol = (/https?/.test($$location.protocol) ? $$location.protocol : 'https') + ':';
        this.hostname = $$location.hostname;
        this.href = $$location.href;
        this.origin = $$location.origin;
        this.ancestorOrigins = (function() {
            return window.location.ancestorOrigins ?
                Array.prototype.slice.call(window.location.ancestorOrigins) :
                [this.origin];
        }.call(this));

        this.loadStartTime = c6.kLoadStart || global.performance.timing.requestStart || null;
        this.guid = ((() => {
            const guid = storage.get(GUID_KEY) || generateId(32);
            storage.set(GUID_KEY, guid);
            return guid;
        })());
        this.loader = !!c6.kParams ? 'c6embed' : 'service';
    }
}

export default new Environment();
