import environment from '../environment.js';
import escapeRegexp from 'escape-regexp';
import urlParser from '../services/url_parser.js';
import {
    reduce
} from '../../lib/utils.js';

export default function completeUrl(url, params = {}) {
    const { debug, href, guid } = environment;
    const timestamp = Date.now();
    const pageUrl = ((() => {
        if (debug) { return 'mutantplayground.com'; }
        const url = urlParser.parse(href);

        return url.origin + url.pathname;
    })());
    const data = [
        // Cinema6 Macros
        ['{pageUrl}', pageUrl],
        ['{cachebreaker}', timestamp],
        ['{guid}', guid],

        // DoubleClick Macros
        ['[timestamp]', timestamp]
    ].concat(reduce(Object.keys(params), (result, macro) => {
        return result.concat([[macro, params[macro]]]);
    }, []));

    return reduce(data, (result, [key, value]) => {
        return result.replace(new RegExp(escapeRegexp(key), 'g'), encodeURIComponent(value));
    }, url || '');
}
