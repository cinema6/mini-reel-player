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

    load(src, ...elt) {
        const options = _(this).configs[src] || { src };
        const {promises} = _(this);
        const domElement = elt[0] || document.head;
        const domMethod  = elt[1] || 'appendChild';
        const domArg     = elt[2];
        return promises[src] || (promises[src] = new RunnerPromise((fulfill, reject) => {
            const script = document.createElement('script');

            script.src = options.src;
            script.async = true;
            script.onload = fulfill;
            script.onerror = (() => reject(new Error(`Failed to load script: [${src}].`)));

            (options.before || noop)();
            domElement[domMethod](script,domArg);
        }).then(options.after));
    }

    loadStyles(src) {
        const { promises } = _(this);

        return promises[src] || (promises[src] = new RunnerPromise((fulfill, reject) => {
            const link = document.createElement('link');
            const image = new Image();

            link.type = 'text/css';
            link.href = src;
            link.rel = 'stylesheet';

            document.head.appendChild(link);

            image.src = src;
            image.onerror = (() => {
                if (link.sheet) {
                    fulfill(link.sheet);
                } else {
                    reject(new Error(`Failed to load styles: [${src}].`));
                }
            });
        }));
    }

    configure(name, config) {
        _(this).configs[name] = config;
    }
}

export default new CodeLoader();
