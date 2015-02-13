import Runner from '../Runner.js';
import View from './View.js';
import twobits from 'twobits.js';
import {
    find,
    forEach
} from '../utils.js';
import {createKey} from 'private-parts';
const _ = createKey();

export default class TemplateView extends View {
    constructor(element) {
        super(element);

        this.children = [];
        this.instantiates = [];

        _(this).compile = null;
    }

    /***********************************************************************************************
     * METHODS
     **********************************************************************************************/
    update(data) {
        if (!_(this).compile) { this.create(); }

        Runner.schedule('render', () => _(this).compile(data));
    }

    /***********************************************************************************************
     * HOOKS
     **********************************************************************************************/
    didCreateElement() {
        super();

        const {element, children, instantiates} = this;

        _(this).compile = twobits.parse(element);

        forEach(element.querySelectorAll('[data-view]'), element => {
            const [prop, className] = element.getAttribute('data-view').split(':');
            const Class = find(instantiates, Class => Class.name === className);

            if (!Class) {
                throw new Error(
                    `Unknown class (${className}). Make sure ` +
                    `your class is in the 'instantiates' array.`
                );
            }

            const instance = new Class(element);

            instance.create();
            this[prop] = instance;

            children.push(instance);
        });
    }

    didInsertElement() {
        super();

        forEach(this.children, child => child.didInsertElement());
    }
}
