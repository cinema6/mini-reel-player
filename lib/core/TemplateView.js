/**
 * @module Lib.View
 */

import Runner from '../Runner.js';
import View from './View.js';
import { views } from './View.js';
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
    instance.parent = view;
    instance.create();
    instance.target = instance.attributes['data-target'] || null;
    instance.action = instance.attributes['data-action'] || null;

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


    view[prop] = instance;
    children.push(instance);

    const model = instance.attributes['data-model'];
    const updateMethod = instance.attributes['data-update-method'] || 'update';

    return model ? function updateInstance(get) {
        instance[updateMethod](get(model));
    } : noop;
});
twobits.directive('use', element => {
    const value = element.getAttribute('xlink:href');
    if (!value || value.charAt(0) !== '#') { return noop; }

    const { protocol, host, pathname } = window.location;
    const url = `${protocol}//${host}${pathname}`;

    element.setAttribute('xlink:href', url + value);

    return noop;
});

/**
 *  A View with templating and directive features from the
 *  [twobits.js](https://github.com/cinema6/twobits.js) library.
 *
 *  Directives
 *  ==========
 *
 *  TemplateView registers a few directives with twobits.js that make it much easier to write
 *  declarative templates.
 *
 *  data-if
 *  -------
 *  This directive will keep the element in the DOM if the property passed to it evaluates to
 *  something truthy. It will remove the element if the property evaluates to something falsy.
 *
 *  ```html
 *  <div data-if="some.prop">Hello world!</div>
 *  ```
 *
 *  data-unless
 *  -----------
 *  This directive is the *inverse* of ```data-if```. The element will be removed if the property
 *  evaluates to something truthy, and kept if it evaluates to something falsy.
 *
 *  ```html
 *  <span data-unless="user.valid">The user is not valid!</span>
 *  ```
 *
 *  data-class
 *  ----------
 *  This directive can be used to dynamically add/remove/set the ```class``` attribute of an
 *  element.
 *
 *  #### Binding to String Values
 *  In the example below, if the ```person.name``` property evaluates to ```"Scott"```, the element
 *  will have the class ```"Scott"```.
 *
 *  ```html
 *  <p data-class="person.name">HELLO!</p>
 *  ```
 *
 *  #### Binding the Adding/Removal of a Class
 *  To add/remove a class depending on the truthiness of a property, the followin syntax can be
 *  used:
 *
 *  *property*```:```*class-name*
 *
 *  If *property* evaluates to something truthy, *class-name* will be added. If it evaluates to
 *  something falsy, *class-name* will be removed. The inverse effect can be achieved if two
 *  ```:```s are used. In that case, if *property* evaluates to something truthy, *class-name* will
 *  be removed. If it evaluates to something falsy, *class-name* will be added.
 *
 *  ```html
 *  <p data-class="user.valid:user--isValid">Foo</p>
 *  <p data-class="user.valid::user--isInvalid">Bar</p>
 *  ```
 *
 *  #### Binding Class Names to Booleans
 *  Using a similar syntax to the one illustrated above, it is possible to specify a class to add
 *  if the property evaluates to something truthy, and a different class to add if it evaluates to
 *  something falsy:
 *
 *  *property*```:```*truthy-class*```:```*falsy-class*
 *
 *  If *property* evaluates to something truthy, *truthy-class* will be added. If it evaluates to
 *  something falsy, *falsy-class* will be added.
 *
 *  ```html
 *  <p data-class="user.valid:user--isValid:user--isInvalid">Hello, {{user.name}}!</p>
 *  ```
 *
 *  #### Creating Multiple Bindings
 *  Multiple bindings can be configured, just seperate the declarations with a space:
 *
 *  ```html
 *  <div data-class="user.name user.valid:user--isValid:user--isInvalid"></div>
 *  ```
 *
 *  data-attributes
 *  ---------------
 *  Much like the ```data-class``` directive, the ```data-attributes``` directive can be used to
 *  create bindings between property values and HTML attribute values.
 *
 *  #### Binding to String Values
 *  To bind the value of an HTML attributes to a property value, the following syntax should be
 *  used:
 *
 *  *html-attribute*```:```*property*
 *
 *  So, in the following example, if ```user.age``` is ```24```, the element will have a data-age
 *  attribute with its value set to ```"24"```.
 *
 *  ```html
 *  <p data-attributes="data-age:user.age"></p>
 *  ```
 *
 *  #### Binding to Boolean Values
 *  If the provided property for binding evaluates to ```true```, the attribute will be added with
 *  **no value**. If the property evaluates to ```false```, the attribute will be **removed**.
 *
 *  This is useful when binding to attributes like ```disabled```:
 *
 *  ```html
 *  <button data-attributes="disabled:data.invalid">Save</button>
 *  ```
 *
 *  data-view
 *  ---------
 *  The data-view directive enables the creation of child View (or View subclass) instances
 *  declaratively in templates. The syntax is as follows:
 *
 *  *property-name*```:```*class-name*
 *
 *  When the TemplateView's element is created, it will look for elements with the ```data-view```
 *  directive. It will lookup the child view's class in its ```instantiates``` object. For example,
 *  if *class-name* is set to ```MyView```, ```instantiates.MyView``` should be a valid ```View```
 *  class. It will then create an instance of that class (passing in the directive's DOM element)
 *  and assign that instance to *property-name* on the ```TemplateView```.
 *
 *  ```javascript
 *  import TemplateView from 'lib/core/TemplateView.js';
 *  import ButtonView from 'views/ButtonView.js';
 *
 *  class MyTemplateView extends TemplateView {
 *      constructor() {
 *          this.tag = 'div';
 *          this.instantiates = { ButtonView: ButtonView };
 *          this.template = '<button data-view="myButton:ButtonView">Click Me!</button>';
 *      }
 *
 *      didCreateElement() {
 *          // myButton property has been set to new ButtonView instance
 *          this.myButton.on('press', () => doStuff());
 *      }
 *  }
 *  ```
 *
 *  #### Child TemplateViews/TemplateView Sub-Classes
 *  When a ```TemplateView``` (or one of its sub-classes) is instantiated via ```data-view```, its
 *  template is ignored by the parent ```TemplateView```. Because it is common to ```update()``` a
 *  child ```View``` with some subset of data passed to the parent there is a declarative way to do
 *  just that. Just add a ```data-model``` attribute to the child with the name of the property
 *  that contains the subset of data. Whenever ```update()``` is called on the parent, the child
 *  will be ```update()```ed with the subset.
 *
 *  ```html
 *  <div data-view="list:ListView" data-model="children"></div>
 *  <!-- list's update() method will be called with the children -->
 *  ```
 *
 *  If a different method should be called instead of ```update()```, its name can be specified via
 *  the ```data-update-method``` attribute.
 *
 *  #### Integration with Target-Action
 *  The target-action event pattern was designed to be used with the ```data-view``` directive.
 *  When an instance is created with ```data-view```, the values of the element's ```data-target```
 *  and ```data-action``` attributes will be used to set the instance's ```target``` and
 *  ```action``` properties, respectively.
 *
 *  Here is an example, showcasing how the target-action event pattern might work, end-to-end:
 *
 *  ```javascript
 *  import Controller from 'lib/core/Controller.js';
 *  import TemplateView from 'lib/core/TemplateView.js';
 *  import View from 'lib/core/View.js';
 *
 *  class ButtonView extends View {
 *      constructor() {
 *          this.tag = 'button';
 *      }
 *
 *      click() {
 *          // When the ButtonView is clicked, send the action
 *          this.sendAction(this);
 *      }
 *  }
 *
 *  class MyView extends TemplateView {
 *      constructor() {
 *          this.tag = 'div';
 *          this.instantiates = {ButtonView};
 *          this.template = `
 *              <button data-view="myButton:ButtonView"
 *                  data-target="controller" data-action="doStuff">
 *                  Click Me!
 *              </button>
 *          `;
 *      }
 *  }
 *
 *  class MyController extends Controller {
 *      constructor() {
 *          this.view = this.addView(new MyView());
 *      }
 *
 *      doStuff(button) {
 *          // When the button is clicked, this method (the action) will be called on this
 *          // controller (the target.)
 *      }
 *  }
 *  ```
 *
 *  ```TemplateView``` also enables the child instance's ```target``` to be ```"view"```. When the
 *  instance's ```target``` is ```"view"```, the action will be looked up as a method on the
 *  ```TemplateView```:
 *
 *  ```javascript
 *  import TemplateView from 'lib/core/TemplateView.js';
 *  import View from 'lib/core/View.js';
 *
 *  class ButtonView extends View {
 *      constructor() {
 *          this.tag = 'button';
 *      }
 *
 *      click() {
 *          // When the ButtonView is clicked, send the action
 *          this.sendAction(this);
 *      }
 *  }
 *
 *  class MyView extends TemplateView {
 *      constructor() {
 *          this.tag = 'div';
 *          this.instantiates = {ButtonView};
 *          this.template = `
 *              <button data-view="myButton:ButtonView"
 *                  data-target="view" data-action="doStuff">
 *                  Click Me!
 *              </button>
 *          `;
 *      }
 *
 *      doStuff(button) {
 *          // When the button is clicked, this method (the action) will be called on this
 *          // controller (the parent view.)
 *      }
 *  }
 *  ```
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
        super.didCreateElement();

        const children = Array.prototype.slice.call(this.element.childNodes);
        const options = {
            context: this,
            filter: node => {
                const parent = node.parentNode;

                return parent === this.element || !(views.get(parent) instanceof TemplateView); // jshint ignore:line
            }
        };
        const compilers = map(children, child => twobits.parse(child, options));

        _(this).compile = (data => forEach(compilers, compile => compile(data)));
    }

    didInsertElement() {
        super.didInsertElement();

        forEach(this.children, child => child.didInsertElement());
    }
}
