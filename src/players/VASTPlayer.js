import CorePlayer from './CorePlayer.js';
import {createKey} from 'private-parts';
import iab from '../services/iab.js';
import browser from '../services/browser.js';
import Runner from '../../lib/Runner.js';

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

        function firePixelsOnce(pixel, predicate) {
            const {vastEvents} = state;
            const {vast} = _player;

            if (predicate() && !vastEvents[pixel]) {
                vast.firePixels(pixel);
                vastEvents[pixel] = true;
            }
        }

        video.addEventListener('loadedmetadata', () => Runner.run(() => {
            player.emit('loadedmetadata');
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
            const {currentTime, duration} = video;

            player.emit('timeupdate');

            if (!duration) { return; }

            firePixelsOnce('firstQuartile', function() {
                return currentTime >= (duration * 0.25);
            });

            firePixelsOnce('midpoint', function() {
                return currentTime >= (duration * 0.5);
            });

            firePixelsOnce('thirdQuartile', function() {
                return currentTime >= (duration * 0.75);
            });

            firePixelsOnce('complete', function() {
                return currentTime >= (duration - 1);
            });
        }), false);

        video.controls = player.controls;
        video.poster = player.poster;

        video.load();
        Runner.schedule('afterRender', () => element.appendChild(video));

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

        return vast ? Promise.resolve(vast) : Promise.reject(null);
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
        if (data !== _player.vast && data.getCompanion()) {
            player.emit('companionsReady');
        }

        return (_player.vast = data);
    }

    function setSrc(vast) {
        var src = vast.getVideoSrc();

        if (!src) {
            return Promise.reject(vast);
        }

        if (src === video.src) {
            return Promise.resolve(video);
        }

        video.src = src;
        return Promise.resolve(video);
    }

    return loadFromCache()
        .catch(loadFromVASTService)
        .then(setState)
        .then(setSrc)
        .catch(function(error) {
            state.error = new Error(
                'VAST request failed: ' + JSON.stringify(error)
            );
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
        load(this).then(function(video) {
            video.play();
        });
    }
    load() {
        load(this);
    }
    unload() {
        const {video} = _(this);

        if (!video) { return; }

        this.element.removeChild(_(this).video);
        _(this).video = null;
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

        return super(...arguments);
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
