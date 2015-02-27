import Runner from '../Runner.js';
import View from './View.js';
import twobits from 'twobits.js';
import {
    forEach,
    extend
} from '../utils.js';
import {createKey} from 'private-parts';
const _ = createKey();

twobits.directive('[data-if]', element => {
    const prop = element.getAttribute('data-if');
    element.insertAdjacentHTML('beforebegin', `<!-- data-if="${prop}" -->`);
    const placeholder = element.previousSibling;

    return function(get) {
        const value = get(prop);

        if (value && !element.parentNode) {
            placeholder.parentNode.insertBefore(element, placeholder.nextSibling);
        } else if (!value && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    };
});

export default class TemplateView extends View {
    constructor(element) {
        super(element);

        this.children = [];
        this.instantiates = {};

        _(this).compile = null;
        _(this).data = {};
    }

    /***********************************************************************************************
     * METHODS
     **********************************************************************************************/
    update(data) {
        if (!_(this).compile) { this.create(); }

        _(this).data = extend(_(this).data, data);

        Runner.schedule('render', () => _(this).compile(_(this).data));
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
            const Class = instantiates[className];

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
