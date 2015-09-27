import CorePlayer from './CorePlayer.js';
import codeLoader from '../services/code_loader.js';
import urlParser from '../services/url_parser.js';
import {createKey} from 'private-parts';
import Runner from '../../lib/Runner.js';
import {extend, defer} from '../../lib/utils.js';
import browser from '../../src/services/browser.js';
import RunnerPromise from '../../lib/RunnerPromise.js';

{
    codeLoader.configure('wistia', {
        src: urlParser.parse('//fast.wistia.net/assets/external/E-v1.js').href
    });
}

const HAVE_NOTHING = 0;
const HAVE_METADATA = 1;
const HAVE_FUTURE_DATA = 3;
const HAVE_ENOUGH_DATA = 4;

const WISTIA_EMBED_OPTIONS = {
    playerPreference: 'html5',
    volume: 1
};

const CLEAN_STATE = {
    currentTime: 0,
    duration: 0,
    ended: false,
    paused: true,
    muted: false,
    volume: 0,
    seeking: false,
    src: null,
    error: null,
    readyState: HAVE_NOTHING,
    poster: null,
    currentSrc: null,
    width: 0,
    height: 0
};

class Private {
    constructor(instance) {
        this.__public__ = instance;
        this.state = extend(CLEAN_STATE);
        this.wistiaEmbed = null;
        this.loading = false;
        this.loadedVideoId = null;
        this.pending = Promise.resolve();
    }

    loadEmbed() {
        const videoId = this.state.src;
        if(videoId && videoId!== this.loadedVideoId) {
            this.loading = true;
            this.unloadEmbed();
            this.loadedVideoId = videoId;

            // Create the Wistia iframe
            const template = require('../../src/views/video_embeds/WistiaEmbedTemplate.html');
            const params = Object.keys(WISTIA_EMBED_OPTIONS).map(key => {
                return key + '=' + WISTIA_EMBED_OPTIONS[key];
            }).join('&');
            const embed = template.replace('{{videoId}}', videoId)
                .replace('{{params}}', params);
            const workspace = document.createElement('div');
            workspace.innerHTML = embed;
            const iframe = workspace.firstChild;
            iframe.onload = () => {
                codeLoader.load('wistia').then(() => {
                    this.__public__.emit('loadstart');
                    this.wistiaEmbed = iframe.wistiaApi;
                    this.addEventListeners();
                    this.wistiaEmbed.hasData(() => {
                        this.setState('readyState', HAVE_METADATA);
                    });
                    this.wistiaEmbed.ready(() => Runner.run(() => {
                        this.loading = false;
                        this.setState('duration', this.wistiaEmbed.duration());
                        this.setState('readyState', HAVE_FUTURE_DATA);
                    }));
                });
            };

            // Append to the player element
            const element = this.__public__.element || this.__public__.create();
            Runner.schedule('afterRender', element, 'appendChild', [iframe]);
        }
    }

    unloadEmbed() {
        this.removeEventListeners();
        this.wistiaEmbed = null;
        this.cleanState();
        this.loadedVideoId = null;
        Runner.schedule('afterRender', null, () => {
            const element = this.__public__.element;
            if(element && element.firstChild) {
                element.removeChild(element.firstChild);
            }
        });
    }

    cleanState() {
        Object.keys(CLEAN_STATE).forEach(key => {
            if(key !== 'src') {
                this.setState(key, CLEAN_STATE[key]);
            }
        });
    }

    ensurePlayerReady() {
        const deferred = defer(Promise);
        if(this.state.readyState >= 3) {
            deferred.fulfill();
        } else if(this.loading) {
            this.__public__.once('canplay', () => deferred.fulfill());
        } else {
            deferred.reject();
        }
        this.pending = this.pending.then(() => {
            return deferred.promise;
        });
        return this.pending;
    }

    addEventListeners() {
        const {wistiaEmbed} = this;
        if(!wistiaEmbed) { return; }
        wistiaEmbed.bind('end', () => Runner.run(() => {
            this.setState('ended', true);
        }));
        wistiaEmbed.bind('pause', () => Runner.run(() => {
            this.setState('paused', true);
        }));
        wistiaEmbed.bind('play', () => Runner.run(() => {
            this.setState('paused', false);
        }));
        wistiaEmbed.bind('seek', () => Runner.run(() => {
            this.setState('seeking', false);
        }));
        wistiaEmbed.bind('timechange', time => Runner.run(() => {
            this.setState('currentTime', time);
        }));
        wistiaEmbed.bind('volumechange', volume => Runner.run(() => {
            this.setState('volume', volume);
        }));
        wistiaEmbed.bind('widthchange', width => Runner.run(() => {
            this.setState('width', width);
        }));
        wistiaEmbed.bind('heightchange', height => Runner.run(() => {
            this.setState('height', height);
        }));
    }

    removeEventListeners() {
        const {wistiaEmbed} = this;
        if(!wistiaEmbed) { return; }
        wistiaEmbed.unbind('end');
        wistiaEmbed.unbind('pause');
        wistiaEmbed.unbind('play');
        wistiaEmbed.unbind('seek');
        wistiaEmbed.unbind('timechange');
        wistiaEmbed.unbind('volumechange');
        wistiaEmbed.unbind('widthchange');
        wistiaEmbed.unbind('heightchange');
    }

    setState(key, value) {
        const currentValue = this.state[key];

        const changedValue = () => {
            return currentValue !== value;
        };
        const becameValue = val => {
            return changedValue() && value === val;
        };
        const becameTrue = () => {
            return becameValue(true);
        };
        const becameFalse = () => {
            return becameValue(false);
        };

        switch(key) {
        case 'ended':
            if(becameTrue()) {
                this.__public__.emit('ended');
            }
            if(becameFalse) {
                this.__public__.emit('playing');
            }
            break;
        case 'seeking':
            if(becameTrue()) {
                this.__public__.emit('seeking');
            }
            if(becameFalse()) {
                this.__public__.emit('seeked');
            }
            break;
        case 'duration':
            if(changedValue()) {
                this.__public__.emit('durationchange');
            }
            break;
        case 'currentTime':
            if(changedValue()) {
                this.__public__.emit('timeupdate');
            }
            break;
        case 'paused':
            if(becameTrue()) {
                this.__public__.emit('pause');
            }
            if(becameFalse()) {
                this.__public__.emit('play');
                this.__public__.emit('playing');
            }
            break;
        case 'volume':
            if(changedValue()) {
                this.__public__.emit('volumechange');
            }
            break;
        case 'src':
            if(becameValue(null)) {
                this.__public__.emit('emptied');
            }
            break;
        case 'readyState':
            if(becameValue(HAVE_METADATA)) {
                this.__public__.emit('loadedmetadata');
            } else if(becameValue(HAVE_FUTURE_DATA)) {
                this.__public__.emit('canplay');
            } else if(becameValue(HAVE_ENOUGH_DATA)) {
                this.__public__.emit('canplaythrough');
            }
            break;
        case 'width':
            if(changedValue()) {
                this.__public__.emit('resize');
            }
            break;
        case 'height':
            if(changedValue()) {
                this.__public__.emit('resize');
            }
            break;
        }
        this.state[key] = value;
    }
}

const _ = createKey(instance => new Private(instance));

function noMethodError(method) {
    return new Error(`WistiaPlayer cannot ${method}.`);
}

export default class WistiaPlayer extends CorePlayer {
    constructor() {
        super(...arguments);
        if (global.__karma__) { this.__private__ = _(this); }
    }

    get src() {
        return _(this).state.src;
    }
    set src(value) {
        if(value !== _(this).state.src) {
            this.unload();
        }
        _(this).setState('src', value);
    }

    get error() {
        return _(this).state.error;
    }

    get readyState() {
        return _(this).state.readyState;
    }

    get currentTime() {
        return _(this).state.currentTime;
    }
    set currentTime(value) {
        _(this).ensurePlayerReady().then(() => {
            _(this).wistiaEmbed.time(value);
        });
    }

    get duration() {
        return _(this).state.duration;
    }

    get ended() {
        return _(this).state.ended;
    }

    get paused() {
        return _(this).state.paused;
    }

    get muted() {
        return _(this).state.muted;
    }

    get volume() {
        return _(this).state.volume;
    }
    set volume(value) {
        _(this).ensurePlayerReady().then(() => {
            _(this).wistiaEmbed.volume(value);
        });
    }

    get seeking() {
        return _(this).state.seeking;
    }

    pause() {
        _(this).ensurePlayerReady().then(() => {
            _(this).wistiaEmbed.pause();
        });
    }

    play() {
        this.load();
        RunnerPromise.all([browser.test('autoplay'), _(this).ensurePlayerReady()]).then(values => {
            const autoplayable = values[0];
            if(autoplayable) {
                this.emit('attemptPlay');
                _(this).wistiaEmbed.play();
            }
        });
    }

    load() {
        _(this).loadEmbed();
    }

    unload() {
        _(this).unloadEmbed();
    }

    reload() {
        this.unload();
        this.load();
    }

    minimize() {
        return noMethodError('minimize');
    }
}
