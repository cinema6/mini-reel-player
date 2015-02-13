import {EventEmitter} from 'events';
import eventDelegator from '../event_delegator.js';
import Runner from '../Runner.js';
import {
    forEach,
    filter
} from '../utils.js';

let counter = 0;

export const views = new WeakMap();

function syncClassesWithElement(view) {
    if (!view.element) { return; }

    Runner.schedule('render', () => {
        view.element.className = view.classes.join(' ');
    });
}

export default class View extends EventEmitter {
    constructor(element) {
        if (element && views.get(element)) {
            const view = views.get(element);

            throw new Error(
                `Cannot create View because the provided ` +
                `element already belongs to [View:${view.id}].`
            );
        }

        this.tag = element ? element.tagName.toLowerCase() : undefined;
        this.id = (element && element.id) || `c6-view-${++counter}`;

        this.template = element ? element.innerHTML : '';
        this.element = element || null;

        this.classes = element && element.className ? element.className.split(' ') : [];
        this.classes.push('c6-view');
        this.attributes = {};
        forEach((element && element.attributes) || [], attribute => {
            this.attributes[attribute.name] = attribute.value;
        });
    }

    /***********************************************************************************************
     * METHODS
     **********************************************************************************************/
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
            element.setAttribute(attribute, this.attributes[attribute]);
        }
        element.innerHTML = this.template;

        this.element = element;
        this.didCreateElement();

        if (document.body.contains(element)) {
            this.didInsertElement();
        }

        return element;
    }

    appendTo(parent) {
        const element = this.element || this.create();
        const parentElement = parent.element || parent.create();

        Runner.schedule('render', () => {
            parentElement.appendChild(element);
            this.didInsertElement();
        });
    }

    append(child) {
        child.appendTo(this);
    }

    remove() {
        const {element} = this;

        this.willRemoveElement();
        this.element = null;
        Runner.schedule('render', () => element.parentNode.removeChild(element));
    }

    addClass(className) {
        const index = this.classes.indexOf(className);

        if (index > -1) { return; }

        this.classes.push(className);
        syncClassesWithElement(this);
    }

    removeClass(className) {
        const index = this.classes.indexOf(className);

        if (index < 0) { return; }

        this.classes.splice(index, 1);
        syncClassesWithElement(this);
    }

    /***********************************************************************************************
     * HOOKS
     **********************************************************************************************/
    didCreateElement() {
        views.set(this.element, this);
        eventDelegator.addListeners(this, filter(eventDelegator.events, event => event in this));
    }

    didInsertElement() {}

    willRemoveElement() {
        views.delete(this.element);
        eventDelegator.removeListeners(this);
    }
}
