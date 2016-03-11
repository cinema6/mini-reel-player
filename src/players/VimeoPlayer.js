import CorePlayer from './CorePlayer.js';
import {createKey} from 'private-parts';
import vimeo from '../services/vimeo.js';
import browser from '../services/browser.js';
import Runner from '../../lib/Runner.js';
import urlParser from '../services/url_parser.js';

const _ = createKey();

function getInitialState() {
    return {
        ready: false,
        hasPlayed: false,
        src: null,

        buffered: 0,
        currentTime: 0,
        duration: 0,
        volume: 0,
        ended: false,
        paused: true,
        readyState: 0,
        seeking: false,
        error: null
    };
}

export default class VimeoPlayer extends CorePlayer {
    constructor() {
        super(...arguments);

        this.autoplay = false;
        this.start = null;
        this.end = null;

        _(this).state = getInitialState();
        _(this).ready = false;
        _(this).src = null;
        _(this).iframe = null;
        _(this).player = null;
    }

    get buffered() {
        return _(this).state.buffered;
    }

    get currentTime() {
        return _(this).state.currentTime;
    }
    set currentTime(value) {
        const start = this.start || 0;
        const end = this.end || Infinity;
        const adjustedTime = Math.min(Math.max(start + value, start), end);
        const {player, state} = _(this);

        if (!player) {
            return (state.currentTime = adjustedTime);
        }

        this.emit('seeking');
        _(this).state.seeking = true;
        player.call('seekTo', adjustedTime);
    }

    get duration() {
        return _(this).state.duration;
    }

    get volume() {
        return _(this).state.volume;
    }

    get ended() {
        return _(this).state.ended;
    }

    get paused() {
        return _(this).state.paused;
    }

    get muted() {
        return _(this).state.volume === 0;
    }

    get readyState() {
        return _(this).state.readyState;
    }

    get seeking() {
        return _(this).state.seeking;
    }

    set src(value) {
        _(this).src = value;
    }
    get src() {
        return _(this).src;
    }

    get error() {
        return _(this).state.error;
    }

    pause() {
        const {player, state: { ready }} = _(this);

        if (ready) { player.call('pause'); }
    }

    play() {
        this.load();

        const {player, state: { ready }} = _(this);
        const callPlay = (() => {
            this.emit('attemptPlay');
            player.call('play');
        });
        const doPlay = (() => {
            browser.test('autoplay').then(autoplayable => {
                if (autoplayable) { return callPlay(); }
            });
        });

        if (ready) { doPlay(); } else { player.once('ready', doPlay); }
    }

    load() {
        if (_(this).state.src && (this.src !== _(this).state.src)) {
            this.unload();
        }
        _(this).state.src = this.src;

        if (_(this).iframe) { return; }

        const element = this.element || this.create();
        const iframe = document.createElement('iframe');

        const attr = ((attribute, value = '') => iframe.setAttribute(attribute, value));

        attr(
            'src',
            urlParser.parse(`//player.vimeo.com/video/${this.src}?api=1&player_id=${this.id}`).href
        );
        attr('width', '100%');
        attr('height', '100%');
        attr('frameborder', '0');
        attr('webkitAllowFullScreen');
        attr('mozallowfullscreen');
        attr('allowFullScreen');

        const player = new vimeo.Player(iframe);
        const start = this.start || 0;
        const end = this.end || Infinity;

        const onceLoadProgress = (() => {
            _(this).state.readyState = 3;
            this.emit('loadstart');
        });
        const checkIfCanPlayThrough = (data => {
            const percent = parseFloat(data.percent);

            if (percent >= 0.25) {
                _(this).state.readyState = 4;
                this.emit('canplaythrough');
                player.removeListener('loadProgress', checkIfCanPlayThrough);
            }
        });
        const onLoadProgress = (data => {
            const percent = parseFloat(data.percent);

            _(this).state.buffered = percent;
            this.emit('progress');
        });
        const onFinish = (() => {
            _(this).state.ended = true;
            this.emit('ended');
        });
        const onPause = (() => {
            _(this).state.paused = true;
            this.emit('pause');
        });
        const onPlay = (() => {
            const {state} = _(this);

            if (state.ended) {
                player.call('seekTo', start);
            }

            state.ended = false;
            state.paused = false;
            this.emit('play');

            state.hasPlayed = true;
        });
        const onSeek = (() => {
            _(this).state.seeking = false;
            this.emit('seeked');
        });
        const onPlayProgress = (({ seconds }) => {
            const time = parseFloat(seconds);
            const {state} = _(this);

            state.currentTime = Math.min(
                Math.max(time - start, 0),
                end - start
            );

            if (time < start) {
                return player.call('seekTo', start);
            } else if (time >= end) {
                state.ended = true;
                this.emit('ended');
                return player.call('pause');
            }

            this.emit('timeupdate');

            player.call('getVolume').then(volume => {
                state.volume = volume;
            });
        });

        player.once('ready', () => {
            const { state } = _(this);

            player.once('loadProgress', onceLoadProgress);
            player.on('loadProgress', checkIfCanPlayThrough);
            player.on('loadProgress', onLoadProgress);
            player.on('finish', onFinish);
            player.on('pause', onPause);
            player.on('play', onPlay);
            player.on('seek', onSeek);
            player.on('playProgress', onPlayProgress);

            player.call('getDuration').then(duration => {
                const {state} = _(this);

                state.duration = (Math.min(end, duration) -  start);
                this.emit('loadedmetadata');
            });

            player.call('getVolume').then(volume => {
                const {state} = _(this);
                state.volume = volume;
            });

            state.ready = true;
            state.readyState = 3;
            this.emit('canplay');
        });

        Runner.schedule('afterRender', element, 'appendChild', [iframe]);

        _(this).iframe = iframe;
        _(this).player = player;
    }

    unload() {
        const {player, iframe} = _(this);
        if (!player) { return super.unload(); }

        player.destroy();
        _(this).state = getInitialState();

        _(this).iframe = null;
        _(this).player = null;

        Runner.schedule('afterRender', this.element, 'removeChild', [iframe]);

        return super.unload();
    }

    reload() {
        this.unload();
        this.load();
    }

    minimize() {
        return new Error('The video cannot be minimized.');
    }

    didInsertElement() {
        if (this.autoplay) { this.play(); }

        return super.didInsertElement(...arguments);
    }
}
