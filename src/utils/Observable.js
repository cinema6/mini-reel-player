import { EventEmitter } from 'events';
import { extend } from '../../lib/utils.js';
import {createKey} from 'private-parts';

const _ = createKey();

export default class Observable extends EventEmitter {
    constructor(config) {
        super();
        _(this).state = extend(config);
        _(this).defaultState = extend(config);

        if (global.__karma__) { this.__private__ = _(this); }
    }

    get(property) {
        return _(this).state[property];
    }

    set(property, value) {
        if(property in _(this).state) {
            const oldValue = _(this).state[property];
            _(this).state[property] = value;
            const changed = (oldValue !== value);
            if(changed) {
                this.emit('change:' + property, value);
            }
        } else {
            throw new Error(`Observable has no ${property} property`);
        }
    }

    reset() {
        _(this).state = extend(_(this).defaultState);
    }
}
