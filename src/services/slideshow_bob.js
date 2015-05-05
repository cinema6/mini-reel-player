import { EventEmitter } from 'events';
import { createKey } from 'private-parts';
import urlParser from './url_parser.js';
import Runner from '../../lib/Runner.js';
import environment from '../environment.js';
import {
    map,
    reduce,
    filter
} from '../../lib/utils.js';

function objectify(query) {
    function convert(value) {
        if ((/^(true|false)$/).test(value)) {
            return value === 'true';
        }

        const number = parseFloat(value);
        return isNaN(number) ? value : number;
    }

    return reduce(
        map(
            map(query.split('&'), pair => map(pair.split('='), decodeURIComponent)),
            pair => pair.length === 2 ? pair : [pair[0], true]
        ),
        (object, pair) => {
            object[pair[0]] = convert(pair[1]);
            return object;
        },
        {}
    );
}

function objectWithout(object, props) {
    return reduce(filter(Object.keys(object), key => props.indexOf(key) < 0), (result, key) => {
        result[key] = object[key];
        return result;
    }, {});
}

const _ = createKey({
    delegateMessage: function(event) {
        const hostname = urlParser.parse(event.origin).hostname;

        if (hostname !== environment.apiRoot) { return; }

        const data = objectify(event.data);

        Runner.run(() => {
            this.players[data.id].emit(data.event, objectWithout(data, ['id', 'event']));
        });
    }
});

let bob;

class Player extends EventEmitter {
    constructor(iframe) {
        const params = objectify(urlParser.parse(iframe.src).search);

        if (!params.id) {
            throw new Error(
                'Provided iFrame has no id specified in the search params.'
            );
        }

        super();
        _(bob).players[params.id] = this;

        _(this).id = params.id;
        _(this).iframe = iframe;
    }

    call(...args) {
        const playerWindow = _(this).iframe.contentWindow;

        playerWindow.postMessage(map(args, encodeURIComponent).join('='), '*');
    }

    destroy() {
        this.removeAllListeners();
        delete _(bob).players[_(this).id];
    }
}

class SlideshowBob {
    constructor() {
        _(this).players = {};

        this.Player = Player;

        global.addEventListener('message', event => _(this).delegateMessage(event), false);
    }
}

bob = new SlideshowBob();

export default bob;

