import {EventEmitter} from 'events';
import {createKey} from 'private-parts';
import RunnerPromise from '../../lib/RunnerPromise.js';
import Runner from '../../lib/Runner.js';
import urlParser from './url_parser.js';
import {
    defer
} from '../../lib/utils.js';

const ORIGIN = 'rumble.com';

const _ = createKey();
let rumble;

class Player extends EventEmitter {
    constructor(iframe) {
        super();

        _(this).pending = {};
        _(this).iframe = iframe;

        const [, id] = (urlParser.parse(iframe.src).search.match(/player_id=((\w|-)+)/) || []);

        if (!id) {
            throw new Error(
                'Provided iFrame has no player_id specified in the search params.'
            );
        }

        this.id = id;

        this.on('newListener', event => {
            if (event.search(
                /^(ready|newListener|removeListener)$/
            ) > -1) { return; }

            this.call('addEventListener', event);
        });

        rumble.players[id] = this;
    }

    call(method, data) {
        const {pending, iframe: { contentWindow } } = _(this);
        if (!contentWindow) {
            return RunnerPromise.reject(
                new Error(
                    `Cannot call ${method}() on RumblePlayer [${this.id}] because it is destroyed.`
                )
            );
        }

        const deferred = pending[method] || defer(RunnerPromise);
        const message = { method };

        if (data !== undefined) {
            message.value = data;
        }

        contentWindow.postMessage(JSON.stringify(message), '*');

        switch (method) {
        case 'play':
        case 'pause':
        case 'seekTo':
        case 'unload':
        case 'setColor':
        case 'setLoop':
        case 'setVolume':
            deferred.fulfill();
            break;

        default:
            pending[method] = deferred;
        }

        return deferred.promise;
    }

    destroy() {
        this.removeAllListeners();
        rumble.players[this.id] = undefined;
    }

    __handleMessage__({ method, event, value, data }) {
        const {pending} = _(this);

        if (method && pending[method]) {
            pending[method].fulfill(value);
            delete pending[method];
        }

        if (event) {
            Runner.run(() => this.emit(event, data || value));
        }
    }
}

class Rumble {
    constructor() {
        this.Player = Player;

        this.players = {};

        global.addEventListener('message', ({ origin, data }) => {
            if (urlParser.parse(origin).hostname !== ORIGIN) { return; }

            const payload = JSON.parse(data);
            /* jshint camelcase:false */
            const player = this.players[payload.player_id];
            /* jshint camelcase:true */

            if (player) {
                player.__handleMessage__(payload);
            }
        }, false);
    }
}

rumble = new Rumble();

export default rumble;
