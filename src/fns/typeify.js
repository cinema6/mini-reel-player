const NUMBER_REGEX = /^\d+(\.\d+)?$/;
import {
    map,
    reduce
} from '../../lib/utils.js';

export default function typeify(value) {
    if (value instanceof Array) {
        return map(value, typeify);
    }

    if (value instanceof Object) {
        return reduce(Object.keys(value), (result, key) => {
            result[key] = typeify(value[key]);
            return result;
        }, {});
    }

    if (typeof value !== 'string') {
        return value;
    }

    switch (value.toLowerCase()) {
    case 'true':
        return true;
    case 'false':
        return false;
    case 'null':
        return null;
    case 'undefined':
        return undefined;
    default:
        return NUMBER_REGEX.test(value) ? parseFloat(value) : value;
    }
}
