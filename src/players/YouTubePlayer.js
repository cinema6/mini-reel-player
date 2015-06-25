import CorePlayer from './CorePlayer.js';
import {createKey} from 'private-parts';
import codeLoader from '../../src/services/code_loader.js';
import fetcher from '../../lib/fetcher.js';
import timer from '../../lib/timer.js';
import browser from '../../src/services/browser.js';
import Runner from '../../lib/Runner.js';
import { stringify } from 'querystring';
import {
    map,
    reduce,
    defer,
    extend
} from '../../lib/utils.js';

{
    const deferred = defer(Promise);

    codeLoader.configure('youtube', {
        src: 'https://www.youtube.com/iframe_api',

        before() {
            global.onYouTubeIframeAPIReady = () => {
                delete global.onYouTubeIframeAPIReady;
                deferred.fulfill(global.YT);
            };
        },

        after() {
            return deferred.promise;
        }
    });
}

const YT_API_KEY  = 'AIzaSyBYOutFJ1yBx8MAYy5OgtTvslvBiFk8wok';
const CLEAN_STATE = {
    readyState: 0,
    duration: 0,
    currentTime: 0,
    paused: true,
    ended: false,
    seeking: false
};

const _ = createKey();

function parseISO8601Duration(timestamp) {
    const durations = map(
        [/\d*H/, /\d*M/, /\d*S/],
        regex => parseInt((timestamp.match(regex) || [0])[0])
    );

    return reduce(durations, (total, time, index) => total + (time * Math.pow(60, 2 - index)), 0);
}

export default class YouTubePlayer extends CorePlayer {
    constructor() {
        super(...arguments);

        this.tag = 'div';

        this.start = null;
        this.end = null;
        this.autoplay = false;
        this.controls = true;

        _(this).state = extend(CLEAN_STATE, {
            src: null,
            error: null,
            poster: null
        });

        _(this).player = null;
        _(this).iframe = null;
        _(this).interval = null;
        _(this).seekStart = null;
        _(this).hasPlayed = false;
    }

    get currentTime() {
        return _(this).state.currentTime;
    }
    set currentTime(value) {
        const {player, state} = _(this);
        const start = this.start || 0;
        const end = this.end || Infinity;
        const time = Math.min(Math.max(start + value, start), end);

        if (player) {
            _(this).seekStart = state.currentTime;
            state.seeking = true;
            this.emit('seeking');
            return player.seekTo(time);
        }

        state.currentTime = time;
    }

    get duration() {
        return _(this).state.duration;
    }

    get volume() {
        const {player} = _(this);

        return player ? (player.getVolume() / 100) : 0;
    }

    get muted() {
        const {player} = _(this);

        return player ? player.isMuted() : false;
    }

    get ended() {
        return _(this).state.ended;
    }

    get paused() {
        return _(this).state.paused;
    }

    get readyState() {
        return _(this).state.readyState;
    }

    get seeking() {
        return _(this).state.seeking;
    }

    get src() {
        return _(this).state.src;
    }
    set src(value) {
        if (value !== _(this).state.src) {
            this.unload();
        }

        _(this).state.src = value;
    }

    get error() {
        return _(this).state.error;
    }

    play() {
        const callPlay = (() => {
            this.emit('attemptPlay');
            _(this).player.playVideo();
        });
        const play = (() => {
            browser.test('autoplay').then(autoplayable => {
                if (autoplayable) { return callPlay(); }
            });
        });

        this.load();
        if (_(this).player) { play(); } else { this.once('canplay', play); }
    }

    pause() {
        if (_(this).player) {
            _(this).player.pauseVideo();
        }
    }

    load() {
        const element = this.element || this.create();
        if (_(this).iframe && _(this).iframe.getAttribute('data-videoid') === this.src) { return; }

        if (_(this).iframe) {
            element.removeChild(_(this).iframe);
        }

        const iframe = _(this).iframe = document.createElement('iframe');
        const params = {
            html5: 1,
            wmode: 'opaque',
            rel: 0,
            enablejsapi: 1,
            playsinline: 1,
            controls: Number(this.controls)
        };
        iframe.setAttribute('data-videoid', this.src);
        iframe.src = `https://www.youtube.com/embed/${this.src}?${stringify(params)}`;

        Runner.schedule('afterRender', null, () => {
            element.appendChild(iframe);

            fetcher.get(
                `https://www.googleapis.com/youtube/v3/videos` +
                `?part=contentDetails&id=${this.src}&key=${YT_API_KEY}`
            ).then(response => response.json()).then(data => {
                const {state} = _(this);
                const duration = parseISO8601Duration(data.items[0].contentDetails.duration);

                state.readyState = Math.max(state.readyState, 1);
                this.emit('loadedmetadata');

                state.duration = Math.min(duration - (this.start || 0), this.end || duration);
                this.emit('durationchange');
            });

            codeLoader.load('youtube').then(youtube => {
                const {PLAYING, PAUSED, BUFFERING, ENDED} = youtube.PlayerState;
                const {state} = _(this);
                const playerStates = [];

                let player;
                const syncCurrentTime = (() => {
                    const currentTime = this.ended ? this.duration : player.getCurrentTime();
                    const {state} = _(this);
                    const end = this.end || Infinity;
                    const start = this.start || 0;

                    if (currentTime === this.currentTime) { return; }

                    if (!this.paused) {
                        if (currentTime < (start - 2)) {
                            player.seekTo(start);
                        }

                        if (currentTime >= end) {
                            player.pauseVideo();
                            state.ended = true;
                            this.emit('ended');
                        }
                    }

                    state.currentTime = Math.max(0, currentTime - start);
                    this.emit('timeupdate');

                    if (state.seeking && state.currentTime !== _(this).seekStart) {
                        state.seeking = false;
                        this.emit('seeked');
                        _(this).seekStart = null;
                    }
                });

                function interruptedByBuffer(STATE) {
                    return playerStates[0] === BUFFERING && playerStates[1] === STATE;
                }

                player = new youtube.Player(iframe, {
                    events: {
                        onReady: () => Runner.run(() => {
                            _(this).player = player;

                            _(this).state.readyState = 3;
                            this.emit('canplay');

                            _(this).interval = timer.interval(syncCurrentTime, 250);
                        }),

                        onStateChange: event => Runner.run(() => {
                            switch (event.data) {
                            case PLAYING:
                                _(this).hasPlayed = true;
                                state.paused = false;
                                state.ended = false;

                                if (!interruptedByBuffer(PLAYING)) {
                                    this.emit('play');
                                }
                                break;

                            case PAUSED:
                                state.paused = true;

                                if (!interruptedByBuffer(PAUSED)) {
                                    this.emit('pause');
                                }
                                break;

                            case ENDED:
                                state.paused = true;
                                state.ended = true;

                                syncCurrentTime();

                                this.emit('pause');
                                this.emit('ended');
                                break;
                            }

                            playerStates.unshift(event.data);
                        })
                    }
                });
            });
        });

        this.emit('loadstart');
    }

    unload() {
        const {state, iframe, interval} = _(this);

        _(this).state = extend(state, CLEAN_STATE);

        if (iframe) {
            Runner.schedule('afterRender', this.element, 'removeChild', [iframe]);
            _(this).iframe = null;
        }

        if (interval) {
            timer.cancel(interval);
            _(this).interval = null;
        }

        _(this).player = null;
        _(this).hasPlayed = false;

        return super();
    }

    reload() {
        this.unload();
        this.load();
    }

    minimize() {
        return new Error('YouTubePlayer cannot be minimized.');
    }


    /***********************************************************************************************
     * Hooks
     **********************************************************************************************/
    didInsertElement() {
        if (this.autoplay) {
            this.play();
        }

        return super(...arguments);
    }
}
