import environment from '../environment.js';
import escapeRegexp from 'escape-regexp';
import {
    reduce
} from '../../lib/utils.js';

export default function completeUrl(url) {
    const { debug, href, guid } = environment;
    const timestamp = Date.now();
    const data = [
        // Cinema6 Macros
        ['{pageUrl}', debug ? 'mutantplayground.com' : href],
        ['{cachebreaker}', timestamp],
        ['{guid}', guid],

        // DoubleClick Macros
        ['[timestamp]', timestamp]
    ];

    return reduce(data, (result, [key, value]) => {
        return result.replace(new RegExp(escapeRegexp(key), 'g'), encodeURIComponent(value));
    }, url || '');
}
