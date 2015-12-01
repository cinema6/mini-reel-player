import CorePlayer from './CorePlayer.js';
import bob from '../services/slideshow_bob.js';
import Runner from '../../lib/Runner.js';
import environment from '../environment.js';
import {
    map
} from '../../lib/utils.js';
import { createKey } from 'private-parts';

function toParams(data) {
    return map(data, pair => map(pair, encodeURIComponent).join('=')).join('&');
}

function getInitialState() {
    return {
        readyState: 0,
        paused: true,
        volume: 1,
        muted: false,
        error: null,

        ready: false,
        hasPlayed: false,
        src: null,
        controls: null
    };
}

const _ = createKey();

export default class SlideshowBobPlayer extends CorePlayer {
    constructor() {
        super(...arguments);

        _(this).video = null;
        _(this).iframe = null;
        _(this).state = getInitialState();

        this.src = null;
        this.controls = true;
        this.autoplay = false;
    }

    get readyState() {
        return _(this).state.readyState;
    }

    get paused() {
        return _(this).state.paused;
    }

    get volume() {
        return _(this).state.volume;
    }

    get muted() {
        return _(this).state.muted;
    }

    get error() {
        return _(this).state.error;
    }

    pause() {
        if (_(this).state.ready) { _(this).video.call('pause'); }
    }

    play() {
        const { state: { ready } } = _(this);
        this.load();

        const doPlay = (() => {
            this.emit('attemptPlay');
            _(this).video.call('play');
        });

        if (ready) { doPlay(); } else { this.once('canplay', doPlay); }
    }

    unload() {
        const { video, iframe } = _(this);
        if (!video) { return; }

        video.destroy();
        _(this).state = getInitialState();
        this.element.removeChild(iframe);

        _(this).video = null;
        _(this).iframe = null;
    }

    reload() {
        this.unload();
        this.load();
    }

    minimize() {
        return new Error('The video cannot be minimized.');
    }

    load() {
        if (this.src === _(this).state.src && this.controls === _(this).state.controls) { return; }

        this.unload();

        _(this).state.src = this.src;
        _(this).state.controls = this.controls;

        const iframe = _(this).iframe = document.createElement('iframe');
        iframe.src = `${environment.apiRoot}/apps/slideshow-bob/index.html?` + toParams([
            ['id', this.id],
        ]);
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('height', '100%');
        iframe.setAttribute('frameborder', '0');

        _(this).state.duration = 1;
        this.emit('loadedmetadata');

        const video = _(this).video = new bob.Player(iframe);
        video.on('ready', () => {
            video.call('load', JSON.parse(this.src));
            _(this).state.ready = true;
            _(this).state.readyState = 3;
            this.emit('canplay');
        });

        video.on('play', () => {
            _(this).state.hasPlayed = true;
            _(this).state.paused = false;
            this.emit('play');
        });

        video.on('pause', () => {
            _(this).state.paused = true;
            this.emit('pause');
        });

        Runner.schedule('afterRender', (this.element || this.create()), 'appendChild', [iframe]);
    }

    didInsertElement() {
        if (this.autoplay) { this.play(); }
        return super.didInsertElement();
    }
}

