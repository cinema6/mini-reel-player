/**
 * Defines generic base classes.
 *
 * @module Lib.Core
 * @main Lib.Core
 */

import {
    forEach
} from '../utils.js';

/**
 * Adds support for the mix-in pattern.
 *
 * @class Mixable
 * @constructor
 */
class Mixable {
    constructor() {
        forEach(this.constructor.mixins, Mixin => Mixin.call(this, ...arguments));
    }
}

/**
 * Array of all the mix-ins that are added to the class.
 *
 * @property mixins
 * @type Function[]
 * @default []
 * @static
 */
Mixable.mixins = [];
/**
 * Extends the class' prototype with the prototypes of the provided mix-ins. Each mix-in's
 * constructor will also be called each time an instance of the class is created.
 *
 * @method mixin
 * @static
 *
 * @param {Function} ...mixins
 */
Mixable.mixin = function(...mixins) {
    this.mixins = this.mixins.concat(mixins);

    forEach(mixins, Mixin => {
        for (let method in Mixin.prototype) {
            const classMethod = this.prototype[method];
            const mixinMethod = Mixin.prototype[method];

            if (classMethod) {
                /*jshint loopfunc: true */
                this.prototype[method] = function(...args) {
                    const hasSuper = 'super' in this;
                    const origSuper = this.super;
                    let result;

                    this.super = classMethod;
                    result = mixinMethod.call(this, ...args);

                    if (hasSuper) { this.super = origSuper; } else { delete this.super; }

                    return result;
                };
            } else {
                this.prototype[method] = mixinMethod;
            }
        }
    });
};

export default Mixable;
