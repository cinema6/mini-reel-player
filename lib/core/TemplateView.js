import Runner from '../Runner.js';
import View from './View.js';
import twobits from 'twobits.js';
import {
    forEach,
    extend,
    map,
    filter,
    noop
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
    const dynamicClasses = map(
        element.getAttribute('data-class').split(/\s+/),
        value => value.split(':')
    );

    return function(get) {
        const values = map(dynamicClasses, ([prop, truthyClass, falsyClass]) => {
            const value = get(prop);
            const isBoolean = !!truthyClass;

            if (isBoolean) {
                return value ? truthyClass : (falsyClass || '');
            } else {
                return value;
            }
        });
        const classes = filter(staticClasses.concat(values), name => !!name); // Trimp empty entries

        element.className = classes.join(' ');
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
            `your class is in the 'instantiates' array.`
        );
    }

    const instance = new Class(element);

    instance.create();
    view[prop] = instance;

    children.push(instance);
    return noop;
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

        _(this).compile = twobits.parse(this.element, this);
    }

    didInsertElement() {
        super();

        forEach(this.children, child => child.didInsertElement());
    }
}
