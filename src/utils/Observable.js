import { EventEmitter } from 'events';
import { extend } from '../../lib/utils.js';
import {createKey} from 'private-parts';

const _ = createKey();

export default class Observable extends EventEmitter {
    constructor(config) {
        super();

        _(this).mutable = true;

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
            const changed = (oldValue !== value);

            if(changed) {
                if (!_(this).mutable) {
                    return this.emit(`reject:${property}`, value);
                }

                _(this).state[property] = value;
                this.emit(`change:${property}`, value);
            }
        } else {
            throw new Error(`Observable has no ${property} property`);
        }
    }

    mutable(value) {
        if (value === undefined) {
            return _(this).mutable;
        }

        return (_(this).mutable = value);
    }

    reset() {
        _(this).state = extend(_(this).defaultState);
    }
}
