/**
 * @module Lib.View
 */

import Runner from '../Runner.js';
import View from './View.js';
import twobits from 'twobits.js';
import {
    forEach,
    extend,
    map,
    filter,
    noop,
    reduce
} from '../utils.js';
import {createKey} from 'private-parts';
const _ = createKey();

function makeConditionallyPresentDirective(name, negated) {
    return function(element) {
        const prop = element.getAttribute(name);
        element.insertAdjacentHTML('beforebegin', `<!-- ${name}="${prop}" -->`);
        const placeholder = element.previousSibling;

        return function(get) {
            const value = negated ? !get(prop) : get(prop);

            if (value && !element.parentNode) {
                placeholder.parentNode.insertBefore(element, placeholder.nextSibling);
            } else if (!value && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        };
    };
}

twobits.directive('[data-if]', makeConditionallyPresentDirective('data-if', false));
twobits.directive('[data-unless]', makeConditionallyPresentDirective('data-unless', true));
twobits.directive('[data-class]', element => {
    const staticClasses = element.className.split(/\s+/);
    const dynamicConfig = map(
        element.getAttribute('data-class').split(/\s+/),
        value => value.split(':')
    );

    let currentClassName = element.className;

    return function(get) {
        const dynamicClasses = map(dynamicConfig, ([prop, truthyClass, falsyClass]) => {
            const value = get(prop);
            const isBoolean = !!truthyClass || !!falsyClass;

            if (isBoolean) {
                return value ? truthyClass : (falsyClass || '');
            } else {
                return value;
            }
        });
        // Merge static classes with dynamic ones. Trim empty entries.
        const className = filter(staticClasses.concat(dynamicClasses), name => !!name).join(' ');

        if (className === currentClassName) { return; }

        element.className = currentClassName = className;
    };
});
twobits.directive('[data-attributes]', element => {
    const config = map(
        element.getAttribute('data-attributes').split(/\s+/),
        value => value.split(':')
    );
    const state = reduce(config, (state, [attribute]) => {
        state[attribute] = null;
        return state;
    }, {});

    return function(get) {
        forEach(config, ([attribute, prop]) => {
            const value = get(prop);

            if (state[attribute] === value) { return; }

            if (value === false) {
                element.removeAttribute(attribute);
            } else {
                element.setAttribute(attribute, (value === true) ? '' : value);
            }

            state[attribute] = value;
        });
    };
});
twobits.directive('[data-view]', (element, view) => {
    if (element === view.element) { return noop; }
    const { children, instantiates } = view;
    const [prop, className] = element.getAttribute('data-view').split(':');
    const Class = instantiates[className];

    if (!Class) {
        throw new Error(
            `Unknown class (${className}). Make sure ` +
            `your class is in the 'instantiates' object.`
        );
    }

    const instance = new Class(element);
    instance.target = element.getAttribute('data-target');
    instance.action = element.getAttribute('data-action');

    instance.on('action', (target, action, args) => {
        if (target !== 'view') {
            return view.emit('action', target, action, args);
        }

        if (typeof view[action] !== 'function') {
            throw new TypeError(
                `TemplateView [${view.id}] tried to respond to action [${action}] from View ` +
                `[${instance.id}] but it does not implement ${action}().`
            );
        }

        view[action](...args);
    });

    instance.create();
    view[prop] = instance;

    children.push(instance);
    return noop;
});

/**
 * A View with templating and directive features from the
 * [twobits.js](https://github.com/cinema6/twobits.js) library.
 *
 * @class TemplateView
 * @constructor
 * @extends View
 */
export default class TemplateView extends View {
    constructor(element) {
        super(element);

        /**
         * An array of this View's children that were instantiated via the ```data-view```
         * directive.
         *
         * @property children
         * @type Array
         * @default []
         * @final
         */
        this.children = [];
        /**
         * A hash that maps the names of classes to actual class objects. This map is used by the
         * ```data-view``` directive to look-up classes by name.
         *
         * @property instantiates
         * @type Object
         * @default {}
         *
         * @example
         *      import MyView from 'MyView.js';
         *      import TemplateView from 'lib/core/TemplateView.js';
         *
         *      class SomeTemplateView extends TemplateView {
         *          constructor() {
         *              this.tag = 'div';
         *
         *              this.instantiates = { AView: MyView };
         *              this.template = '<div data-view="childView:AView"></div>';
         *          }
         *      }
         */
        this.instantiates = {};

        _(this).compile = null;
        _(this).data = {};
    }

    /***********************************************************************************************
     * METHODS
     **********************************************************************************************/
    /**
     * Makes twobits.js update the DOM with the provided data.
     *
     * @method update
     *
     * @param {Object} data
     *
     * @example
     *      import TemplateView from 'lib/core/TemplateView.js';
     *
     *      class MyView extends TemplateView {
     *          constructor() {
     *              this.tag = 'span';
     *              this.template = '<p>{{a}} + {{b}} = {{c}}</p>';
     *          }
     *      }
     *
     *      let view = new MyView();
     *
     *      view.update({
     *          a: '1',
     *          b: '2',
     *          c: '3'
     *      });
     */
    update(data) {
        if (!_(this).compile) { this.create(); }

        _(this).data = extend(_(this).data, data);

        Runner.scheduleOnce('render', null, _(this).compile, [_(this).data]);
    }

    /***********************************************************************************************
     * HOOKS
     **********************************************************************************************/
    didCreateElement() {
        super();

        const children = Array.prototype.slice.call(this.element.childNodes);
        const compilers = map(children, child => twobits.parse(child, this));
        _(this).compile = (data => forEach(compilers, compile => compile(data)));
    }

    didInsertElement() {
        super();

        forEach(this.children, child => child.didInsertElement());
    }
}
