import {EventEmitter} from 'events';
import Mixable from './Mixable.js';
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

        this.inserted = false;
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

    appendTo(parent) {
        const element = this.element || this.create();
        const parentElement = parent.element || parent.create();

        Runner.schedule('render', () => {
            parentElement.appendChild(element);
            if (!this.inserted) {
                this.didInsertElement();
            }
        });
    }

    insertInto(parent, before = null) {
        const element = this.element || this.create();
        const parentElement = parent.element || parent.create();
        const beforeElement = before && before.element;

        Runner.schedule('render', () => {
            parentElement.insertBefore(element, beforeElement);
            if (!this.inserted) {
                this.didInsertElement();
            }
        });
    }

    append(child) {
        child.appendTo(this);
    }

    insert(child, sibling) {
        child.insertInto(this, sibling);
    }

    remove() {
        const {element} = this;

        if (!element) { return; }

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

    setAttribute(attribute, value) {
        if (this.attributes[attribute] === value) { return; }

        this.attributes[attribute] = value;

        if (this.element) {
            if (value === false) {
                Runner.schedule('render', () => this.element.removeAttribute(attribute));
            } else {
                Runner.schedule('render', () => {
                    this.element.setAttribute(attribute, value === true ? '' : value);
                });
            }
        }
    }

    /***********************************************************************************************
     * HOOKS
     **********************************************************************************************/
    didCreateElement() {
        views.set(this.element, this);
        eventDelegator.addListeners(this, filter(eventDelegator.events, event => event in this));
    }

    didInsertElement() {
        this.inserted = true;
    }

    willRemoveElement() {
        views.delete(this.element);
        eventDelegator.removeListeners(this);
        this.removeAllListeners();
        this.inserted = false;
    }
}
View.mixin(EventEmitter);

export default View;
