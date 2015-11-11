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
        const oldValue = _(this).state[property];
        if(oldValue !== undefined) {
            _(this).state[property] = value;
            const changed = (oldValue !== value);
            const becameTrue = (changed && value === true);
            const becameFalse = (changed && value === false);
            const events = [];
            if(changed) {
                events.push('change');
            }
            if(becameTrue) {
                events.push('becameTrue');
            }
            if(becameFalse) {
                events.push('becameFalse');
            }
            events.forEach(eventName => {
                this.emit(eventName + ':' + property, value);
            });
        }
    }
    
    reset() {
        _(this).state = extend(_(this).defaultState);
    }
}
