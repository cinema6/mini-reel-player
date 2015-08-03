import CorePlayer from './CorePlayer.js';
import dailymotion from '../services/dailymotion.js';
import fetcher from '../../lib/fetcher.js';
import Runner from '../../lib/Runner.js';
import browser from '../services/browser.js';
import media from '../services/media.js';
import urlParser from '../services/url_parser.js';
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
        duration: 0,
        currentTime: 0,
        ended: false,
        paused: true,
        seeking: false,
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

export default class DailymotionPlayer extends CorePlayer {
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

    get duration() {
        return _(this).state.duration;
    }

    get currentTime() {
        return _(this).state.currentTime;
    }
    set currentTime(value) {
        if (_(this).state.ready) { return _(this).video.call('seek', value); }
        _(this).state.currentTime = value;
    }

    get ended() {
        return _(this).state.ended;
    }

    get paused() {
        return _(this).state.paused;
    }

    get seeking() {
        return _(this).state.seeking;
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

        const callPlay = (() => {
            this.emit('attemptPlay');
            _(this).video.call('play');
        });
        const play = (() => {
            browser.test('autoplay').then(autoplayable => {
                if (autoplayable) { return callPlay(); }
            });
        });

        if (ready) { play(); } else { this.once('canplay', play); }
    }

    unload() {
        const { video, iframe } = _(this);
        if (!video) { return super(); }

        video.destroy();
        _(this).state = getInitialState();

        _(this).video = null;
        _(this).iframe = null;

        Runner.schedule('afterRender', this.element, 'removeChild', [iframe]);

        return super();
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
        iframe.src = urlParser.parse(`//www.dailymotion.com/embed/video/${this.src}?` + toParams([
            ['api', 'postMessage'],
            ['id', this.id],
            ['related', 0],
            ['chromeless', this.controls ? 0 : 1],
            ['webkit-playsinline', 1]
        ].concat(!!media.bestVideoFormat(['video/mp4']) ? [['html']] : []))).href;
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('height', '100%');
        iframe.setAttribute('frameborder', '0');

        fetcher.get(`https://api.dailymotion.com/video/${this.src}?fields=duration`)
            .then(response => response.json())
            .then(({ duration }) => {
                _(this).state.readyState = Math.max(this.readyState, 1);
                _(this).state.duration = duration;
                this.emit('loadedmetadata');
            });

        const video = _(this).video = new dailymotion.Player(iframe);
        video.on('apiready', () => {
            _(this).state.ready = true;
            _(this).state.readyState = 3;
            this.emit('canplay');
        });
        video.on('timeupdate', ({ time }) => {
            _(this).state.currentTime = time;
            this.emit('timeupdate');
        });
        video.on('durationchange', ({ duration }) => {
            if (duration !== this.duration) {
                _(this).state.duration = duration;
                this.emit('durationchange');
            }
        });
        video.on('ended', () => {
            _(this).state.ended = true;
            this.emit('ended');
        });
        video.on('playing', () => {
            _(this).state.hasPlayed = true;
            _(this).state.paused = false;
            _(this).state.ended = false;
            this.emit('play');
        });
        video.on('pause', () => {
            _(this).state.paused = true;
            this.emit('pause');
        });
        video.on('seeking', () => {
            _(this).state.seeking = true;
            this.emit('seeking');
        });
        video.on('seeked', () => {
            _(this).state.seeking = false;
            this.emit('seeked');
        });
        video.on('volumechange', ({ volume, muted }) => {
            _(this).state.volume = volume;
            _(this).state.muted = muted;
        });

        Runner.schedule('afterRender', (this.element || this.create()), 'appendChild', [iframe]);
    }

    didInsertElement() {
        if (this.autoplay) { this.play(); }
        return super();
    }
}
