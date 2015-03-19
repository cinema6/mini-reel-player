import {EventEmitter} from 'events';
import {createKey} from 'private-parts';
import RunnerPromise from '../../lib/RunnerPromise.js';
import urlParser from './url_parser.js';
import {
    defer
} from '../../lib/utils.js';

const ORIGIN = 'player.vimeo.com';

const _ = createKey();
let vimeo;

class Player extends EventEmitter {
    constructor(iframe) {
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

        vimeo.players[id] = this;
    }

    call(method, data) {
        const {pending, iframe} = _(this);
        const deferred = pending[method] || defer(RunnerPromise);
        const message = { method };

        if (data !== undefined) {
            message.value = data;
        }

        iframe.contentWindow.postMessage(JSON.stringify(message), '*');

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
        vimeo.players[this.id] = undefined;
    }

    __handleMessage__({ method, event, value, data }) {
        const {pending} = _(this);

        if (method && pending[method]) {
            pending[method].fulfill(value);
            delete pending[method];
        }

        if (event) {
            this.emit(event, data || value);
        }
    }
}

class Vimeo {
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

vimeo = new Vimeo();

export default vimeo;
