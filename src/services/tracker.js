import {createKey} from 'private-parts';
import {
    noop
} from '../../lib/utils.js';

function isObject(value) {
    return Object(value) === value;
}

function existy(value) {
    return value !== undefined && value !== null;
}

const _ = createKey();
let tracker;

class TrackerContext {
    constructor(name, api) {
        this.created = false;
        this.ctxName = (name === '_default') ? '' : name;
        this.aliases = {};
        this.makePagePath = noop;

        _(this).api = api;
    }

    alias(name, nameAlias) {
        const setAlias = ((name, value) => {
            if (value === null) {
                delete this.aliases[name];
            } else if (value !== undefined) {
                this.aliases[name] = value;
            }

            return this.aliases[name] || name;
        });

        if (isObject(name)) {
            const config = name;

            for (let key in config) {
                setAlias(key, config[key]);
            }

            return this;
        }

        return setAlias(name, nameAlias);
    }

    methodContext(method) {
        return this.ctxName ? `${this.ctxName}.${method}` : method;
    }

    create(...args) {
        const {api} = _(tracker);

        global[api]('create', ...args);
        global[api](this.methodContext('require'), 'displayfeatures');

        this.created = true;

        return this;
    }

    set(...args) {
        if (args.length === 2) {
            args[0] = this.alias(args[0]);
        } else if (isObject(args[0])) {
            const props = args[0];
            const aliased = {};

            for (let key in props) {
                aliased[this.alias(key)] = props[key];
            }

            args[0] = aliased;
        }

        global[_(tracker).api](this.methodContext('set'), ...args);

        return this;
    }

    trackPage(...args) {
        const [page, title] = args;

        if (args.length > 1) {
            args = [{ page, title }];
        } else if (isObject(page)) {
            const props = args[0];
            const aliased = {};

            for (let key in props) {
                aliased[this.alias(key)] = props[key];
            }

            args[0] = aliased;
        }

        global[_(tracker).api](this.methodContext('send'), 'pageview', ...args);

        return this;
    }

    trackEvent(...args) {
        const props = { hitType: 'event' };

        if (isObject(args[0])) {
            args = args[0];

            for (let key in args) {
                props[this.alias(key)] = args[key];
            }
        } else {
            const [category, action, label, value] = args;

            props.eventCategory = category;
            props.eventAction = action;

            if (existy(label)) {
                props.eventLabel = label;
            }
            if (existy(value)) {
                props.eventValue = value;
            }
        }

        global[_(tracker).api](this.methodContext('send'), props);

        return this;
    }

    trackTiming(...args) {
        const props = { hitType: 'timing' };

        if (isObject(args[0])) {
            args = args[0];

            for (let key in args) {
                props[this.alias(key)] = args[key];
            }
        } else {
            const [category, variable, value, label] = args;

            props.timingCategory = category;
            props.timingVar = variable;

            if (existy(value)) {
                props.timingValue = value;
            }
            if (existy(label)) {
                props.timingLabel = label;
            }
        }

        global[_(tracker).api](this.methodContext('send'), props);

        return this;
    }
}

class Tracker {
    constructor() {
        _(this).api = 'ga';
        _(this).contexts = {};

        if (global.__karma__) { this.__private__ = _(this); }
    }

    api(value) {
        if (value !== undefined) {
            _(this).api = value;
        }
        return _(this).api;
    }

    get(name = '_default') {
        return _(this).contexts[name] || (_(this).contexts[name] = new TrackerContext(name));
    }
}

tracker = new Tracker();

export default tracker;
