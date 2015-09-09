import {
    reduce
} from '../../lib/utils.js';

function SafelyGettable() {}
SafelyGettable.prototype = {
    get: function get(props) {
        const parts = (props || '').match(/[^.\[\]]+/g) || [];

        return reduce(parts, (result, prop) => result && result[prop], this);
    }
};

export default SafelyGettable;
