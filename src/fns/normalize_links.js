import {
    reduce
} from '../../lib/utils.js';

export default function normalizeLinks(links) {
    return reduce(Object.keys(links || {}), (result, label) => {
        const value = links[label];

        result[label] = (typeof value === 'object') ? value : { uri: value, tracking: [] };

        return result;
    }, {});
}
