import {createKey} from 'private-parts';
import {
    forEach
} from '../../lib/utils.js';

const _ = createKey();

class Dispatcher {
    constructor() {
        _(this).listeners = {};
        _(this).listenersByClient = new WeakMap();
        _(this).emitterHandlers = new WeakMap();
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

        new Client(register, ...args);
    }

    removeClient(Client) {
        const {listenersByClient} = _(this);

        forEach(listenersByClient.get(Client), entry => entry.removed = true);
        listenersByClient.delete(Client);
    }

    addSource(type, emitter, events, data = {}) {
        const {listeners, emitterHandlers} = _(this);
        const handlers = [];

        emitterHandlers.set(emitter, handlers);

        forEach(events, event => {
            const eventData = { type, data, name: event, target: emitter };
            const handler = ((...args) => {
                const bucket = ((listeners[type] || {})[event]) || [];

                forEach(bucket.slice(), entry => {
                    const {handler, removed} = entry;

                    if (removed) {
                        bucket.slice(bucket.indexOf(entry), 1);
                    } else {
                        handler(eventData, ...args);
                    }
                });
            });

            emitter.on(event, handler);
            handlers.push({event , handler});
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
