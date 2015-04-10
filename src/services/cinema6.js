import {EventEmitter} from 'events';
import postMessage from './post_message.js';
import global from '../../lib/global.js';
import {createKey} from 'private-parts';
import RunnerPromise from '../../lib/RunnerPromise.js';
import {
    defer
} from '../../lib/utils.js';

const _ = createKey();

class Cinema6 extends EventEmitter {
    constructor() {
        super(...arguments);

        this.ready = false;

        _(this).session = defer(RunnerPromise);
        _(this).appData = defer(RunnerPromise);
        _(this).options = undefined;

        if (!!global.__karma__) { this.__private__ = _(this); }
    }

    init(config = {}) {
        const session = postMessage.createSession(global.parent);

        session.request('handshake').then(handshakeData => {
            const completeHandshake = () => {
                this.ready = true;
                this.emit('ready', true);
                session.emit('ready', true);
                session.ping('ready', true);
                _(this).session.fulfill(session);
            };

            _(this).appData.fulfill(handshakeData.appData);

            let setupResult;

            if (config.setup) {
                setupResult = config.setup(handshakeData.appData);
            }

            if (setupResult instanceof Promise) {
                setupResult.then(completeHandshake);
            } else {
                completeHandshake();
            }
        });

        _(this).options = config;

        return session;
    }

    getSession() {
        return _(this).session.promise;
    }

    getAppData() {
        return _(this).appData.promise;
    }

    fullscreen(bool) {
        return this.getSession().then(session => session.ping('fullscreenMode', !!bool));
    }
}

export default new Cinema6();
