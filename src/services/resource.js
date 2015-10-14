import RunnerPromise from '../../lib/RunnerPromise.js';
import { createKey } from 'private-parts';

const _ = createKey();

const JSON_MIME = 'application/json';

class Resource {
    constructor() {
        _(this).cache = {};
    }

    get(src) {
        const node = document.querySelector(`head script[data-src="${src}"]`);
        const { cache } = _(this);

        if (!node) {
            return RunnerPromise.reject(new Error(`Could not find resource [${src}].`));
        }

        const type = node.getAttribute('type');
        const text = node.textContent;

        return cache[src] || (cache[src] = RunnerPromise.resolve(
            (type === JSON_MIME) ? JSON.parse(text) : text
        ));
    }
}

export default new Resource();
