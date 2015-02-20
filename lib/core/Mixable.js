import {
    forEach
} from '../utils.js';

class Mixable {
    constructor() {
        forEach(this.constructor.mixins, Mixin => Mixin.call(this));
    }
}

Mixable.mixins = [];
Mixable.mixin = function(...mixins) {
    this.mixins = this.mixins.concat(mixins);

    forEach(mixins, Mixin => {
        for (let method in Mixin.prototype) {
            this.prototype[method] = Mixin.prototype[method];
        }
    });
};

export default Mixable;
