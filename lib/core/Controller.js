/**
 * Provides the base class for all Controllers.
 *
 * @module Lib.Controller
 * @main Lib.Controller
 */

import Mixable from './Mixable.js';

/**
 * Should be used as the base class for all Controllers. Provides support for the target-action
 * pattern and mix-ins.
 *
 * @class Controller
 * @extends Mixable
 * @constructor
 */
export default class Controller extends Mixable {
    /**
     * Registers a View with the controller to handle target-action events.
     *
     * @method addView
     * @return {View} The view passed as the first argument
     *
     * @param {View} view
     *
     * @example
     *      import MyView from 'MyView.js';
     *      import Controller from 'lib/core/Controller.js';
     *
     *      class MyController extends Controller {
     *          constructor() {
     *              let view = new MyView();
     *
     *              view.target = 'controller';
     *              view.action = 'sayHello';
     *
     *              this.registerView(view);
     *
     *              view.sendAction('World');
     *              // sayHello() will be called with 'World' as the name
     *          }
     *
     *          sayHello(name) {
     *              alert(\`Hello, ${name}!\`);
     *          }
     *      }
     */
    addView(view) {
        return view.on('action', (target, action, args) => {
            if (target !== 'controller') { return; }

            if (typeof this[action] !== 'function') {
                throw new TypeError(
                    `Controller tried to respond to action [${action}] from View [${view.id}] but` +
                    ` it does not implement ${action}().`
                );
            }

            this[action](...args);
        });
    }
}
