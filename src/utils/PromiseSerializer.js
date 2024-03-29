import {createKey} from 'private-parts';
import {noop} from '../../lib/utils.js';

const _ = createKey();

export default class PromiseSerializer {
    constructor(PromiseClass) {
        _(this).pending = PromiseClass.resolve();

        if (global.__karma__) { this.__private__ = _(this); }
    }

    call(promiseFn) {
        _(this).pending = _(this).pending.then(promiseFn).catch(noop);
    }
}
