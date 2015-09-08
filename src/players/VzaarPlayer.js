import CorePlayer from './CorePlayer.js';
import codeLoader from '../services/code_loader.js';
import urlParser from '../services/url_parser.js';
import {createKey} from 'private-parts';
import vzaarEmbedView from '../views/video_embeds/vzaarEmbedView.js';
import Runner from '../../lib/Runner.js';
import {defer} from '../../lib/utils.js';
import timer from '../../lib/timer.js';

{
    codeLoader.configure('vzaar', {
        src: urlParser.parse('//player.vzaar.com/libs/flashtakt/client.js').href,
        after() {
            return global.vzPlayer;
        }
    });
}

class Private {
    constructor(instance) {
        this.__public__ = instance;
        this.loadedVideoId = null;
        this.vzPlayer = null;
        this.embedView = new vzaarEmbedView();
        this.state = {
            currentTime: 0,
            duration: 0,
            ended: false,
            paused: true,
            muted: false,
            volume: 0,
            seeking: false
        };
        this.interval = null;
    }

    loadEmbed() {
        const deferred = defer(Promise);
        const videoId = this.__public__.src;
        if(videoId && videoId !== this.loadedVideoId) {
            this.__public__.unload();
            this.embedView.update({
                id: videoId
            });
            this.__public__.append(this.embedView);
            Runner.schedule('afterRender', this, () => {
                codeLoader.load('vzaar').then(VzPlayer => {
                    const vzPlayer = this.vzPlayer = new VzPlayer('vzvd-' + videoId);
                    vzPlayer.ready(() => {
                        vzPlayer.addEventListener('playState', state => {
                            if(state === 'mediaStarted') {
                                this.state.ended = false;
                                this.state.seeking = false;
                            } else if(state === 'mediaEnded') {
                                this.state.ended = true;
                            }
                        });
                        vzPlayer.addEventListener('interaction', interaction => {
                            switch (interaction) {
                            case 'pause':
                                this.state.paused = true;
                                break;
                            case 'resume':
                                this.state.paused = false;
                                break;
                            case 'soundOn':
                                this.state.muted = false;
                                break;
                            case 'soundOff':
                                this.state.muted = true;
                                break;
                            case 'seekbarhandle':
                                this.state.seeking = true;
                                break;
                            }
                        });
                        Runner.runNext(() => {
                            this.loadedVideoId = videoId;
                            this.__public__.readyState = 3;
                            this.__public__.emit('canplay');
                            deferred.fulfill(vzPlayer);
                        });
                    });
                });
            });
        } else {
            deferred.fulfill(this.vzPlayer);
        }
        return deferred.promise;
    }

    startPolling() {
        if(!this.interval) {
            this.interval = timer.interval(() => this.updateState, 250);
        }
    }

    stopPolling() {
        if(this.interval) {
            timer.cancel(this.interval);
            this.interval = null;
        }
    }

    updateState() {
        if(this.vzPlayer) {
            this.vzPlayer.getTime(time => {
                this.state.currentTime = time;
            });
            this.vzPlayer.getTotalTime(time => {
                this.state.duration = time;
            });
            this.vzPlayer.getVolume(vol => {
                const MAX_VOLUME = 5;
                this.state.volume = vol / MAX_VOLUME;
            });
        } else {
            this.stopPolling();
        }
    }
}

const _ = createKey(instance => new Private(instance));

function noMethodError(method) {
    return new Error(`VzaarPlayer cannot ${method}.`);
}

export default class VzaarPlayer extends CorePlayer {
    constructor() {
        super(...arguments);

        this.src = null;
        this.readyState = 0;
        this.error = null;
        this.poster = null;

        if (global.__karma__) { this.__private__ = _(this); }
    }

    get currentTime() {
        return _(this).state.currentTime;
    }
    set currentTime(value) {
        if(_(this).vzPlayer) {
            _(this).vzPlayer.seekTo(value);
            _(this).state.currentTime = value;
        }
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
    set muted(value) {
        if(_(this).vzPlayer) {
            _(this).state.muted = value;
            _(this).vzPlayer[value ? 'muteOn' : 'muteOff']();
        }
    }

    get volume() {
        return _(this).state.volume;
    }
    set volume(value) {
        if(_(this).vzPlayer) {
            _(this).state.volume = value;
            _(this).vzPlayer.setVolume(value * 5);
        }
    }

    get seeking() {
        return _(this).state.seeking;
    }

    pause() {
        if(_(this).vzPlayer) {
            _(this).vzPlayer.pause();
        }
    }

    play() {
        return _(this).loadEmbed().then(vzPlayer => {
            vzPlayer.play2();
        });
    }

    load() {
        _(this).loadEmbed();
        _(this).startPolling();
    }

    unload() {
        _(this).stopPolling();
        _(this).vzPlayer = null;
        _(this).loadedVideoId = null;
        _(this).embedView.remove();
    }

    reload() {
        this.unload();
        this.load();
    }

    minimize() {
        return noMethodError('minimize');
    }
}
