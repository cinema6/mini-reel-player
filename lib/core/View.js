/**
 * Provides library classes for DOM-related tasks.
 *
 * @module Lib.View
 * @main Lib.View
 */

import {EventEmitter} from 'events';
import Mixable from './Mixable.js';
import eventDelegator from '../event_delegator.js';
import Runner from '../Runner.js';
import {createKey} from 'private-parts';
import {
    forEach,
    filter
} from '../utils.js';

let counter = 0;

export const views = new WeakMap();

const _ = createKey({
    queueSetAttribute: function(attribute, value) {
        // If the attribute has already been queued to be set, just modify the existing instruction.
        let setLength = this.attributeSets.length;
        while (setLength--) {
            let set = this.attributeSets[setLength];
            if (!set) { continue; }

            if (set[0] === attribute) {
                return (set[1] = value);
            }
        }

        // If the attribute was set to be removed, don't remove it anymore.
        let removeIndex = this.attributeRemovals.indexOf(attribute);
        if (removeIndex > -1) { this.attributeRemovals[removeIndex] = null; }

        this.attributeSets.push([attribute, value]);
    },

    queueRemoveAttribute: function(attribute) {
        // If the attribute was queued to be set, don't set it anymore (because it will just be
        // removed.)
        let setLength = this.attributeSets.length;
        while (setLength--) {
            if (this.attributeSets[setLength][0] === attribute) {
                this.attributeSets[setLength] = null;
                break;
            }
        }
        // If the attribute was already queued to be removed, don't do anything.
        if (this.attributeRemovals.indexOf(attribute) > -1) { return; }

        this.attributeRemovals.push(attribute);
    }
});

function syncClassesWithElement() {
    if (!this.element) { return; }
    this.element.className = this.classes.join(' ');
}

function syncAttributesWithElement() {
    const { attributeSets, attributeRemovals } = _(this);
    let item;

    while ((item = attributeSets.pop()) !== undefined) {
        if (!item) { continue; }
        this.element.setAttribute(item[0], item[1]);
    }
    while ((item = attributeRemovals.pop()) !== undefined) {
        if (!item) { continue; }
        this.element.removeAttribute(item);
    }
}

/**
 * A wrapper around a single DOM element. View provides functionality to make performing
 * DOM-related tasks much simpler.
 *
 * @class View
 * @extends Mixable
 * @constructor
 *
 * @param {Element} [element] A DOM element to wrap.
 */
class View extends Mixable {
    constructor(element) {
        super();

        if (element && views.get(element)) {
            const view = views.get(element);

            throw new Error(
                `Cannot create View because the provided ` +
                `element already belongs to [View:${view.id}].`
            );
        }

        _(this).attributeSets = [];
        _(this).attributeRemovals = [];

        /**
         * The tag the View's element should have (div, span, p, a, li, etc.) If a View subclass
         * does **not** provide a value for this property, View will throw an error when creating
         * its element.
         *
         * @property tag
         * @type String
         * @default undefined
         */
        this.tag = element ? element.tagName.toLowerCase() : undefined;
        /**
         * This property will reflect the element's id property. If not specified, an ID will be
         * generated for the View.
         *
         * @property id
         * @type String
         * @default "c6-view-**"
         */
        this.id = (element && element.id) || `c6-view-${++counter}`;

        /**
         * This property will reflect the HTML contents of the View's element.
         *
         * @property template
         * @type String
         * @default null
         */
        this.template = element ? element.innerHTML : '';
        /**
         * A reference to the View's DOM element. It will be set when the View is ```create()```ed.
         *
         * @property element
         * @type Element
         * @default null
         * @final
         */
        this.element = element || null;

        /**
         * The DOM element's classes, as an array.
         *
         * @property classes
         * @type String[]
         * @default ["c6-view"]
         */
        this.classes = element && element.className ? element.className.split(' ') : [];
        this.classes.push('c6-view');
        /**
         * The element's attributes, represented as a hash. For example,
         * ```<div data-age="24"></div>``` would have an attributes hash of
         * ```
         * { "data-age": "24" }
         * ```.
         *
         * Setting a property's value to ```true``` will add that attributes with no value. Setting
         * the value to ```false``` will remove the attribute.
         *
         * @property attributes
         * @type Object
         * @default {}
         */
        this.attributes = {};
        forEach((element && element.attributes) || [], attribute => {
            this.attributes[attribute.name] = attribute.value;
        });

        /**
         * Indicates if the View's element is in the DOM.
         *
         * @property inserted
         * @type Boolean
         * @final
         */
        this.inserted = false;

        /**
         * The target for the view's action.
         *
         * @property target
         * @type any
         * @default null
         */
        this.target = null;
        /**
         * The actions for the view's target.
         *
         * @property action
         * @type any
         * @default null
         */
        this.action = null;
    }

    /***********************************************************************************************
     * METHODS
     **********************************************************************************************/

    /**
     * Creates an ```Element``` that is configured based on the ```View```'s properties. If the
     * View already has an element, it will "sync" the element's attributes with the View's
     * configuration.
     *
     * @method create
     * @return {Element} The newly-created DOM element for the View
     */
    create() {
        if (!this.tag) {
            throw new Error(
                `Cannot create element for [View:${this.id}] because 'tag' is undefined.`
            );
        }

        const element = this.element || document.createElement(this.tag);

        element.id = this.id;
        element.className = this.classes.join(' ');
        for (let attribute in this.attributes) {
            const value = this.attributes[attribute];

            element.setAttribute(attribute, value === true ? '' : value);
        }
        if (this.template !== element.innerHTML) {
            element.innerHTML = this.template;
        }

        this.element = element;
        this.didCreateElement();

        if (document.body.contains(element)) {
            this.didInsertElement();
        }

        return element;
    }

    /**
     * Inserts the View into the DOM as a child of the provided View. If the DOM element for
     * either View does not yet exist, it will be created.
     *
     * @method appendTo
     *
     * @param {View} parent
     */
    appendTo(parent) {
        const element = this.element || this.create();
        const parentElement = parent.element || parent.create();

        Runner.schedule('render', null, () => {
            parentElement.appendChild(element);
            if (!this.inserted) {
                this.didInsertElement();
            }
        });
    }

    /**
     * Inserts the View into the DOM as a child of the provided View, before a specified sibling
     * View. If the DOM element for any of the Views does not yet exist, they will be created.
     *
     * @method insertInto
     *
     * @param {View} parent
     * @param {View} [before]
     */
    insertInto(parent, before = null) {
        const element = this.element || this.create();
        const parentElement = parent.element || parent.create();
        const beforeElement = before && before.element;

        Runner.schedule('render', null, () => {
            parentElement.insertBefore(element, beforeElement);
            if (!this.inserted) {
                this.didInsertElement();
            }
        });
    }

    /**
     * Inserts a provided View as a child of this View. If the DOM element for either View does not
     * yet exist, it will be created.
     *
     * @method append
     *
     * @param {View} child
     */
    append(child) {
        child.appendTo(this);
    }

    /**
     * Inserts a provided View as a child of this View before the specified sibling View. If the DOM
     * element for any of the Views does not yet exist, they will be created.
     *
     * @method insert
     *
     * @param {View} child
     * @param {View} [sibling]
     */
    insert(child, sibling) {
        child.insertInto(this, sibling);
    }

    /**
     * Removes the View's element from the DOM.
     *
     * @method remove
     */
    remove() {
        const { element, inserted } = this;

        if (!inserted) { return; }

        this.willRemoveElement();
        Runner.schedule('render', element.parentNode, 'removeChild', [element]);
    }

    /**
     * Removes the View's element from the DOM and cleans up all event listeners from it.
     *
     * @method destroy
     */
    destroy() {
        if (!this.element) { return; }

        this.remove();
        this.willDestroyElement();
        this.element = null;
    }

    /**
     * Adds a class to the element and updates the ```classes``` Array.
     *
     * @method addClass
     *
     * @param {String} className
     */
    addClass(className) {
        const index = this.classes.indexOf(className);

        if (index > -1) { return; }

        this.classes.push(className);
        Runner.scheduleOnce('render', this, syncClassesWithElement);
    }

    /**
     * Removes a class from the element and updates the ```classes``` Array.
     *
     * @method removeClass
     *
     * @param {String} className
     */
    removeClass(className) {
        const index = this.classes.indexOf(className);

        if (index < 0) { return; }

        this.classes.splice(index, 1);
        Runner.scheduleOnce('render', this, syncClassesWithElement);
    }

    /**
     * Sets an attributes on the element and udpates the ```attributes``` hash.
     *
     * @method setAttribute
     *
     * @param {String} attribute
     * @param value {any} If ```true```, the attribute will be added with no value. If ```false```,
     * the attribute will be removed.
     */
    setAttribute(attribute, value) {
        if (this.attributes[attribute] === value) { return; }

        this.attributes[attribute] = value;

        if (this.element) {
            if (value === false) {
                _(this).queueRemoveAttribute(attribute);
            } else {
                _(this).queueSetAttribute(attribute, value === true ? '' : value);
            }

            Runner.scheduleOnce('render', this, syncAttributesWithElement);
        }
    }

    /**
     * Emits the ```action``` event (used for target-action) with the value of the ```target```
     * property, the value of the ```action``` property and the arguments passed to the method.
     *
     * @method sendAction
     *
     * @param {any} [...args]
     */
    sendAction(...args) {
        const { target, action } = this;
        if (!target || !action) { return; }

        this.emit('action', target, action, args);
    }

    /**
     * Causes the browser to reflow the element.
     *
     * @method reflow
     */
    reflow() {
        this.element && this.element.offsetHeight; // jshint ignore:line
    }

    /***********************************************************************************************
     * HOOKS
     **********************************************************************************************/
    /**
     * This is called when the View's element is created.
     *
     * @method didCreateElement
     */
    didCreateElement() {
        views.set(this.element, this);
        eventDelegator.addListeners(this, filter(eventDelegator.events, event => event in this));
    }

    /**
     * This is called when the View's element is inserted into a parent element.
     *
     * @method didInsertElement
     */

    /**
     * Fired when the View's element is inserted into the document.
     *
     * @event inserted
     */
    didInsertElement() {
        this.inserted = true;
        this.emit('inserted');
    }

    /**
     * This is called right before the View's element is removed from the DOM.
     *
     * @method willRemoveElement
     */

    /**
     * Fired right before the View's element is removed from the document.
     *
     * @event removed
     */
    willRemoveElement() {
        this.inserted = false;
        this.emit('removed');
    }

    /**
     * This is called right before the View's element is destroyed.
     *
     * @method willDestroyElement
     */

    /**
     * Fired right before the View's element is destroyed.
     *
     * @event destroyed
     */
    willDestroyElement() {
        this.emit('destroyed');
        views.delete(this.element);
        eventDelegator.removeListeners(this);
        this.removeAllListeners();
    }
}
View.mixin(EventEmitter);

export default View;
