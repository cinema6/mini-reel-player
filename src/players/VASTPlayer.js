import CorePlayer from './CorePlayer.js';
import {createKey} from 'private-parts';
import iab from '../services/iab.js';
import browser from '../services/browser.js';
import Runner from '../../lib/Runner.js';
import RunnerPromise from '../../lib/RunnerPromise.js';
import media from '../services/media.js';

const _ = createKey();

let exitFullscreen = function(video) {
    const documentExitFullscreen = document.exitFullscreen ||
        document.msExitFullscreen ||
        document.mozCancelFullScreen ||
        document.webkitExitFullscreen;

    const videoExitFullscreen = video.exitFullscreen ||
        video.msExitFullscreen ||
        video.mozCancelFullScreen ||
        video.webkitExitFullscreen;

    if (documentExitFullscreen) {
        exitFullscreen = function() {
            documentExitFullscreen.call(document);
        };
    } else {
        exitFullscreen = function(video) {
            videoExitFullscreen.call(video);
        };
    }

    exitFullscreen(video);
};

function getInitialState() {
    return {
        vastEvents: {},
        error: null,
        hasStarted: false
    };
}

function initializeVideo(player) {
    const _player = _(player);
    const {state} = _player;

    return _player.video || (function(video) {
        const element = player.element || player.create();

        video.addEventListener('loadedmetadata', () => Runner.run(() => {
            player.emit('loadedmetadata');
        }), false);
        video.addEventListener('canplay', () => Runner.run(() => {
            player.emit('canplay');
        }), false);
        video.addEventListener('play', () => Runner.run(() => {
            const {vast} = _player;

            if (!state.hasStarted) {
                state.hasStarted = true;
                vast.firePixels('impression');
                vast.firePixels('loaded');
                vast.firePixels('creativeView');
                vast.firePixels('start');
                vast.firePixels('playing');
            }
            player.emit('play');
        }), false);
        video.addEventListener('pause', () => Runner.run(() => {
            const {vast} = _player;

            vast.firePixels('pause');
            player.emit('pause');
        }), false);
        video.addEventListener('error', () => Runner.run(() => {
            state.error = new Error(
                'HTML5 Video Error: ' + video.error.code
            );
            player.emit('error');
        }), false);
        video.addEventListener('ended', () => Runner.run(() => {
            player.emit('ended');
        }), false);
        video.addEventListener('timeupdate', () => Runner.run(() => {
            player.emit('timeupdate');
        }), false);

        video.controls = player.controls;
        if (player.poster) { video.poster = player.poster; }
        video.setAttribute('webkit-playsinline', '');

        media.loadMedia(video);
        video.load();
        Runner.schedule('afterRender', element, 'appendChild', [video]);

        return (_(player).video = video);
    }(document.createElement('video')));
}

function load(player) {
    const _player = _(player);
    const {src} = player;
    const {vastCache, state} = _player;
    const video = initializeVideo(player);

    function loadFromCache() {
        var vast = vastCache[src];

        return vast ? RunnerPromise.resolve(vast) : RunnerPromise.reject(null);
    }

    function loadFromVASTService() {
        function cache(vast) {
            /* jshint boss:true */
            return (vastCache[src] = vast);
        }

        return iab.getVAST(src)
            .then(cache);
    }

    function setState(data) {
        const isNew = data !== _player.vast;

        _player.vast = data;

        if (isNew && data.getCompanion()) {
            player.emit('companionsReady');
        }

        return data;
    }

    function setSrc(vast) {
        var source = vast.getVideoSrc();

        if (!source) {
            return Promise.reject(vast);
        }

        if (source === video.src) {
            return Promise.resolve(video);
        }

        video.src = source;
        return Promise.resolve(video);
    }

    return loadFromCache()
        .catch(loadFromVASTService)
        .then(setState)
        .then(setSrc)
        .catch(function(error) {
            const message = error instanceof Error ? error.message : JSON.stringify(error);

            state.error = new Error(`VAST request failed: ${message}`);
            player.emit('error');

            return Promise.reject(error);
        });
}

export default class VASTPlayer extends CorePlayer {
    constructor() {
        super(...arguments);

        this.tag = 'div';

        this.src = null;

        this.controls = true;
        this.autoplay = false;
        this.disableClickthrough = false;

        _(this).vastCache = {};
        _(this).vast = null;
        _(this).video = null;
        _(this).state = getInitialState();
        _(this).src = null;

        this.on('firstQuartile', () => _(this).vast.firePixels('firstQuartile'));
        this.on('midpoint', () => _(this).vast.firePixels('midpoint'));
        this.on('thirdQuartile', () => _(this).vast.firePixels('thirdQuartile'));
        this.on('complete', () => _(this).vast.firePixels('complete'));
    }

    get error() {
        return _(this).state.error;
    }

    get currentTime() {
        const {video} = _(this);

        return video ? video.currentTime : 0;
    }
    set currentTime(value) {
        _(this).video.currentTime = value;
    }

    get ended() {
        const {video} = _(this);

        return video ? video.ended : false;
    }

    get duration() {
        const {video} = _(this);

        return video ? video.duration : 0;
    }

    get volume() {
        const {video} = _(this);

        return video ? video.volume : 0;
    }

    get muted() {
        const {video} = _(this);

        return video ? video.muted : false;
    }

    get paused() {
        const {video} = _(this);

        return video ? video.paused : true;
    }

    get readyState() {
        const {video} = _(this);

        return video ? video.readyState : 0;
    }

    get seeking() {
        const {video} = _(this);

        return video ? video.seeking : false;
    }

    pause() {
        const {video} = _(this);

        if (video) {
            video.pause();
        }
    }
    play() {
        this.emit('attemptPlay');

        load(this).then(function(video) {
            video.play();
        });
    }
    load() {
        load(this);
    }
    unload() {
        const {video} = _(this);

        if (!video) { return super.unload(); }

        media.unloadMedia(video);

        _(this).video = null;
        _(this).vast = null;

        Runner.schedule('afterRender', this.element, 'removeChild', [video]);

        return super.unload();
    }
    reload() {
        this.unload();
        this.load();
    }
    minimize() {
        exitFullscreen(_(this).video);
    }
    getCompanions() {
        const {vast} = _(this);
        const companion = vast && vast.getCompanion();

        return companion && [companion];
    }

    didInsertElement() {
        if (this.autoplay) {
            browser.test('autoplay').then(autoplayable => {
                if (autoplayable) {
                    this.play();
                }
            });
        }

        return super.didInsertElement(...arguments);
    }

    click() {
        if (this.controls || this.disableClickthrough) { return; }

        const {vast, video} = _(this);

        if (!(vast && vast.clickThrough && vast.clickThrough.length > 0)) {
            return;
        }

        if (video.paused) {
            video.play();
        } else {
            video.pause();
            global.open(vast.clickThrough[0]);
            vast.firePixels('videoClickTracking');
        }
    }
}
