import {EventEmitter} from 'events';
import global from '../../lib/global.js';
import {createKey} from 'private-parts';
import {
    defer,
    noop
} from '../../lib/utils.js';
import RunnerPromise from '../../lib/RunnerPromise.js';
import Runner from '../../lib/Runner.js';

const _ = createKey({
    ping(win, event, type, data) {
        const message = { __c6__: { event: event, type: type, data: data } };

        win.postMessage(JSON.stringify(message), '*');
    },

    newRequestId(session) {
        let id = 0;

        while (session._pending[id]) {
            id++;
        }

        return id;
    },

    getSessionByWindow(win) {
        for (let id in this.sessions) {
            let session = this.sessions[id];

            if (session.window === win) {
                return session;
            }
        }
    },

    handleMessage(event) {
        let eventData = event.data;

        let c6;
        try {
            c6 = JSON.parse(eventData).__c6__;
        } catch (err) {
            c6 = undefined;
        }

        if (!c6) { return; }

        const eventName = c6.event;
        const type = c6.type.split(':');
        const typeName = type[0];
        const typeId = type[1];
        const data = c6.data;
        const session = this.getSessionByWindow(event.source);

        if (typeName === 'request') {
            const done = response => {
                this.ping(event.source, eventName, ('response:' + typeId), response);
            };

            Runner.run(() => session.emit(eventName, data, done));
        } else if (typeName === 'response') {
            session._pending[typeId].fulfill(data);
        } else if (typeName === 'ping') {
            Runner.run(() => session.emit(eventName, data, function() {}));
        }
    }
});

class Session extends EventEmitter {
    constructor(id, win, _private) {
        super();

        this.id = id;
        this.window = win;
        this._pending = {};

        _(this)._ = _private;
    }

    ping(event, data) {
        _(this)._.ping(this.window, event, 'ping', data);
    }

    request(event, data) {
        const deferred = defer(RunnerPromise);
        const id = _(this)._.newRequestId(this);

        this._pending[id] = deferred;

        _(this)._.ping(this.window, event, ('request:' + id), data);

        return deferred.promise;
    }
}


class PostMessage {
    constructor() {
        _(this).sessionCount = 0;
        _(this).sessions = {};

        global.addEventListener('message', event => _(this).handleMessage(event), false);

        if (!!window.__karma__) {
            this.__private__ = _(this);
        }
    }

    createSession(win) {
        const session = new Session(_(this).sessionCount++, win, _(this));

        _(this).sessions[session.id] = session;

        return session;
    }

    destroySession(id) {
        const session = _(this).sessions[id];

        for (let key in session) {
            const value = session[key];

            if (typeof value === 'function') {
                session[key] = noop;
            } else {
                session[key] = undefined;
            }
        }

        delete _(this).sessions[id];
    }

    getSession(id) {
        return _(this).sessions[id];
    }
}


export default new PostMessage();
