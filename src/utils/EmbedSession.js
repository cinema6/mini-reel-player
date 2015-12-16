import PostMessageSession from 'rc-post-message-session';
import Runner from '../../lib/Runner.js';
import RunnerPromise from '../../lib/RunnerPromise.js';
import { createKey } from 'private-parts';
import {
    forEach
} from '../../lib/utils.js';

const _ = createKey();

export default class EmbedSession extends PostMessageSession {
    constructor() {
        super(window.parent);

        _(this).pending = [];

        this.ready = false;

        this.data = null;
        this.experience = null;

        this.once('ready', () => {
            forEach(_(this).pending, args => this.post(...args));
            _(this).pending = [];
        });
    }

    emit(event, ...args) {
        if (event === 'data' || event === 'ready') {
            return super.emit(event, ...args);
        }

        return Runner.run(() => super.emit(event, ...args));
    }

    post(type, event, data, id = EmbedSession.getID()) {
        if (
            this.ready ||
            type === 'ping' && event === 'ready' ||
            type === 'request' && event === 'handshake' ||
            type === 'response'
        ) {
            return super.post(type, event, data, id);
        }

        _(this).pending.push([type, event, data, id]);

        return id;
    }

    request() {
        return RunnerPromise.resolve(super.request(...arguments));
    }

    init(data) {
        return this.request('handshake', data).then(({ appData }) => {
            this.data = appData;
            this.experience = appData.experience || null;

            this.emit('data', appData);

            return (() => {
                this.ready = true;
                this.ping('ready');
                this.emit('ready');
            });
        });
    }

    getData() {
        if (this.data) {
            return RunnerPromise.resolve(this.data);
        }

        return new RunnerPromise(resolve => this.once('data', resolve));
    }

    getExperience() {
        const error = new Error('No experience was provided.');

        if (this.experience) {
            return RunnerPromise.resolve(this.experience);
        }

        if (this.data) {
            return RunnerPromise.reject(error);
        }

        return new RunnerPromise((resolve, reject) => this.once('data', ({ experience }) => {
            if (experience) { resolve(experience); } else { reject(error); }
        }));
    }

    setStyles(styles) {
        return this.ping('responsiveStyles', styles);
    }
}
