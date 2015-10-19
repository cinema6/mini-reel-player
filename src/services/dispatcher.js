import {createKey} from 'private-parts';
import {
    forEach
} from '../../lib/utils.js';

const _ = createKey({
    dispatchEvent(type, event, ...args) {
        const { listeners } = this;
        const bucket = ((listeners[type] || {})[event]) || [];

        forEach(bucket.slice(), entry => {
            const {handler, removed} = entry;

            if (removed) {
                bucket.slice(bucket.indexOf(entry), 1);
            } else {
                handler(...args);
            }
        });
    }
});

class Dispatcher {
    constructor() {
        _(this).listeners = {};
        _(this).listenersByClient = new WeakMap();
        _(this).emitterHandlers = new WeakMap();
        _(this).instances = new WeakMap();
    }

    addClient(Client, ...args) {
        const {listeners, listenersByClient} = _(this);
        const clientBucket = [];

        listenersByClient.set(Client, clientBucket);

        const register = ((handler, type, ...events) => {
            if (!listenersByClient.get(Client)) { return; }

            const group = listeners[type] || (listeners[type] = {});
            const entry = { handler, removed: false };

            forEach(events, event => {
                const bucket = group[event] || (group[event] = []);

                bucket.push(entry);
                clientBucket.push(entry);
            });
        });

        _(this).instances.set(Client, new Client(register, ...args));
    }

    removeClient(Client) {
        const { listenersByClient, instances } = _(this);

        forEach(listenersByClient.get(Client), entry => entry.removed = true);
        listenersByClient.delete(Client);
        instances.delete(Client);
    }

    getClient(Client) {
        return _(this).instances.get(Client);
    }

    addSource(type, emitter, events, data = {}) {
        const { emitterHandlers } = _(this);
        const handlers = emitterHandlers.get(emitter) || [];

        emitterHandlers.set(emitter, handlers);

        forEach(events, event => {
            const eventData = { type, data, name: event, target: emitter };
            const handler = ((...args) => _(this).dispatchEvent(type, event, eventData, ...args));

            emitter.on(event, handler);
            handlers.push({event , handler});
        });

        _(this).dispatchEvent(type, '@addSource', {
            type, data,
            name: '@addSource',
            target: emitter
        });
    }

    removeSource(emitter) {
        const {emitterHandlers} = _(this);

        forEach(emitterHandlers.get(emitter) || [], ({ event, handler}) => {
            emitter.removeListener(event, handler);
        });
        emitterHandlers.delete(emitter);
    }
}

export default new Dispatcher();
