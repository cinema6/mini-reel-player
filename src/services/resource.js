import RunnerPromise from '../../lib/RunnerPromise.js';
import { createKey } from 'private-parts';

const _ = createKey();

const JSON_MIME = 'application/json';

class Resource {
    constructor() {
        _(this).cache = {};
    }

    getSync(src) {
        const node = document.querySelector(`head script[data-src="${src}"]`);

        if (!node) {
            throw new Error(`Could not find resource [${src}].`);
        }

        const type = node.getAttribute('type');
        const text = node.textContent;

        return (type === JSON_MIME) ? JSON.parse(text) : text;
    }

    get(src) {
        const { cache } = _(this);

        return cache[src] || (cache[src] = RunnerPromise.resolve().then(() => this.getSync(src)));
    }
}

export default new Resource();
