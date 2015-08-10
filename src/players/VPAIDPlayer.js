import CorePlayer from './CorePlayer.js';
import iab from '../services/iab.js';
import { createKey } from 'private-parts';
import timer from '../../lib/timer.js';
import Runner from '../../lib/Runner.js';

const _ = createKey();

function getInitialState() {
    return {
        readyState: 0,
        duration: 0,
        currentTime: 0,
        paused: true,
        ended: false,

        src: null,
        ready: false,
        started: false
    };
}

function cleanup(player) {
    const { interval } = _(player);

    if (interval) { timer.cancel(interval); }

    _(player).player = null;
    _(player).interval = null;
    _(player).state = getInitialState();
}

export default class VPAIDPlayer extends CorePlayer {
    constructor() {
        super(...arguments);

        _(this).state = getInitialState();
        _(this).player = null;
        _(this).interval = null;

        this.src = null;
        this.controls = false;
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

    get paused() {
        return _(this).state.paused;
    }

    get ended() {
        return _(this).state.ended;
    }

    get muted() {
        return false;
    }

    get seeking() {
        return false;
    }

    get error() {
        return null;
    }

    get volume() {
        const { player } = _(this);
        const adVolume = player && player.adVolume;

        return (Number(adVolume) === adVolume) ? adVolume : 1;
    }
    set volume(value) {
        const { player } = _(this);

        if (player) { try { player.adVolume = value; } catch(e) {} }
    }

    load() {
        if (this.src === _(this).state.src) { return; }

        cleanup(this);
        this.unload();

        const element = this.element || this.create();
        const player = _(this).player = new iab.VPAIDPlayer(this.src);

        _(this).state.src = this.src;

        const play = (() => {
            if (!_(this).state.paused) { return; }

            _(this).state.paused = false;
            _(this).state.ended = false;
            this.emit('play');
        });
        const pause = (() => {
            _(this).state.paused = true;
            this.emit('pause');
        });
        const companionsReady = (() => {
            this.emit('companionsReady');
        });
        const ended = (() => {
            if (_(this).state.ended) { return; }

            cleanup(this);
            _(this).state.ended = true;
            this.emit('ended');
        });
        const error = (() => {
            cleanup(this);
            this.emit('error');
        });

        player.on('AdStarted', play);
        player.on('AdPlaying', play);
        player.on('AdVideoStart', play);
        player.on('AdPaused', pause);
        player.on('displayBanners', companionsReady);
        player.on('AdStopped', ended);
        player.on('AdVideoComplete', ended);
        player.on('AdError', error);

        player.once('AdStarted', () => _(this).state.started = true);
        player.once('AdLoaded', () => {
            _(this).interval = timer.interval(() => {
                const { adDuration, adCurrentTime } = player;
                const duration = Math.max(adDuration, 0);

                if (duration && !this.duration) {
                    _(this).state.duration = duration;
                    this.emit('loadedmetadata');
                } else if (duration) {
                    _(this).state.duration = duration;
                }

                if (adCurrentTime && (this.currentTime !== adCurrentTime)) {
                    _(this).state.currentTime = adCurrentTime;
                    this.emit('timeupdate');
                }
            }, 250);

            _(this).state.ready = true;
            _(this).state.readyState = 3;
            this.emit('canplay');
        });

        Runner.schedule('afterRender', null, () => {
            player.load(element).then(() => player.initAd());
        });
    }

    play() {
        this.emit('attemptPlay');
        this.load();

        const { state: { ready, started }, player } = _(this);
        const play = (() => {
            if (started) { player.resumeAd(); } else { player.startAd(); }
        });

        if (ready) { play(); } else { this.once('canplay', play); }
    }

    pause() {
        const { state: { ready }, player } = _(this);
        if (!player) { return; }

        const pause = (() => player.pauseAd());

        if (ready) { pause(); } else { this.once('canplay', pause); }
    }

    unload() {
        super();
        const { state: { ready }, player } = _(this);
        if (!player) { return; }

        const stop = (() => {
            cleanup(this);
            player.stopAd();
        });

        if (ready) { stop(); } else { this.once('canplay', stop); }
    }

    reload() {
        this.unload();
        this.load();
    }

    getCompanions() {
        const { player } = _(this);

        return (player && player.adBanners) || null;
    }

    minimize() {}
}
