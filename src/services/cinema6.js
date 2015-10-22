import { EventEmitter } from 'events';
import postMessage from './post_message.js';
import resource from './resource.js';
import browser from './browser.js';
import environment from '../environment.js';
import { createKey } from 'private-parts';
import RunnerPromise from '../../lib/RunnerPromise.js';
import {
    defer,
    extend,
    noop
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

        session.request('handshake').then(({ appData }) => {
            const data = extend(appData, { autoLaunch: false });
            const completeHandshake = () => {
                this.ready = true;
                this.emit('ready', true);
                session.emit('ready', true);
                session.ping('ready', true);
                _(this).session.fulfill(session);
            };

            _(this).appData.fulfill(data);
            RunnerPromise.resolve((config.setup || noop)(data)).then(completeHandshake);
        });

        _(this).options = config;

        return session;
    }

    getSession() {
        return _(this).session.promise;
    }

    getAppData() {
        const { standalone, interstitial, autoLaunch = true } = environment.params; // jshint ignore:line

        return resource.get('experience').then(experience => browser.getProfile().then(profile => ({
            experience,
            profile,
            standalone,
            interstitial,
            autoLaunch
        }))).catch(() => _(this).appData.promise);
    }

    fullscreen(bool) {
        return this.getSession().then(session => session.ping('fullscreenMode', !!bool));
    }
}

export default new Cinema6();
