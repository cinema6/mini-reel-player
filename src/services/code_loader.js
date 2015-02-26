import RunnerPromise from '../../lib/RunnerPromise.js';
import {createKey} from 'private-parts';
import {
    noop
} from '../../lib/utils.js';

const _ = createKey();

class CodeLoader {
    constructor() {
        _(this).configs = {};
        _(this).promises = {};
    }

    load(src) {
        const options = _(this).configs[src] || { src };
        const {promises} = _(this);

        return promises[src] || (promises[src] = new RunnerPromise((fulfill, reject) => {
            const script = document.createElement('script');

            script.src = options.src;
            script.async = true;
            script.onload = fulfill;
            script.onerror = (() => reject(new Error(`Failed to load script: [${src}].`)));

            (options.before || noop)();
            document.head.appendChild(script);
        }).then(options.after));
    }

    configure(name, config) {
        _(this).configs[name] = config;
    }
}

export default new CodeLoader();
