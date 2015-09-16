import CorePlayer from './CorePlayer.js';
import codeLoader from '../services/code_loader.js';
import urlParser from '../services/url_parser.js';
import {createKey} from 'private-parts';
import Runner from '../../lib/Runner.js';
import {defer, extend} from '../../lib/utils.js';
import timer from '../../lib/timer.js';
import browser from '../../src/services/browser.js';


{
    codeLoader.configure('vzaar', {
        src: urlParser.parse('//player.vzaar.com/libs/flashtakt/client.js').href,
        after() {
            return global.vzPlayer;
        }
    });
}

const CLEAN_STATE = {
    currentTime: 0,
    duration: 0,
    ended: false,
    paused: true,
    muted: false,
    volume: 0,
    seeking: false
};

class Private {
    constructor(instance) {
        this.__public__ = instance;
        this.loadedVideoId = null;
        this.vzPlayer = null;
        this.embedElement = null;
        this.state = extend(CLEAN_STATE);
        this.interval = null;
        this.loadingPromise = null;
    }

    loadEmbed() {
        const deferred = defer(Promise);
        const videoId = this.__public__.src;
        const viewId = this.__public__.id;
        if(videoId && videoId !== this.loadedVideoId) {
            if(this.loadedVideoId) {
                this.__public__.unload();
                this.__public__.emit('emptied');
            }

            this.loadedVideoId = videoId;

            // Create the Vzaar embed code
            let embed = require('../../src/views/video_embeds/VzaarEmbedView.html');
            embed = embed.replace(/{{videoId}}/g, videoId).replace(/{{viewId}}/g, viewId);

            // Create the element containing the embed code
            const workspace = document.createElement('div');
            workspace.innerHTML = embed;
            this.embedElement = workspace;

            const element = this.__public__.element || this.__public__.create();

            Runner.schedule('afterRender', this, () => {
                element.appendChild(workspace);
                codeLoader.load('vzaar').then(VzPlayer => {
                    const vzPlayer = this.vzPlayer = new VzPlayer(viewId + '_vzvd-' + videoId);
                    this.__public__.emit('loadstart');
                    vzPlayer.ready(() => {
                        Runner.run(() => {
                            this.__public__.emit('loadeddata');
                            this.__public__.emit('loadedmetadata');
                            vzPlayer.addEventListener('playState', state => {
                                Runner.run(() => {
                                    switch(state) {
                                    case 'mediaStarted':
                                        this.setState('ended', false);
                                        break;
                                    case 'mediaPaused':
                                        this.setState('paused', true);
                                        break;
                                    case 'mediaPlaying':
                                        this.setState('seeking', false);
                                        this.setState('paused', false);
                                        break;
                                    case 'mediaEnded':
                                        this.setState('ended', true);
                                        break;
                                    }
                                });
                            });
                            vzPlayer.addEventListener('interaction', interaction => {
                                Runner.run(() => {
                                    switch (interaction) {
                                    case 'pause':
                                        this.setState('paused', true);
                                        break;
                                    case 'resume':
                                        this.setState('paused', false);
                                        break;
                                    case 'soundOn':
                                        this.setState('muted', false);
                                        break;
                                    case 'soundOff':
                                        this.setState('muted', true);
                                        break;
                                    case 'seekbarhandle':
                                        this.setState('seeking', true);
                                        break;
                                    }
                                });
                            });
                            this.startPolling();
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
        if(!this.loadingPromise) {
            this.loadingPromise = Promise.resolve(null);
        }
        this.loadingPromise = this.loadingPromise.then(() => {
            return deferred.promise;
        });
        return this.loadingPromise;
    }

    startPolling() {
        if(!this.interval) {
            this.interval = timer.interval(() => this.updateState(), 250);
        }
    }

    stopPolling() {
        if(this.interval) {
            timer.cancel(this.interval);
            this.interval = null;
        }
    }

    setState(key, value) {
        const currentValue = this.state[key];
        const becameTrue = !currentValue && value;
        const becameFalse = currentValue && !value;
        const changedValue = currentValue !== value;
        switch(key) {
        case 'ended':
            if(becameTrue) {
                this.__public__.emit('ended');
            }
            if(becameFalse) {
                this.__public__.emit('playing');
            }
            break;
        case 'seeking':
            if(becameTrue) {
                this.__public__.emit('seeking');
            }
            if(becameFalse) {
                this.__public__.emit('seeked');
            }
            break;
        case 'duration':
            if(changedValue) {
                this.__public__.emit('durationchange');
            }
            break;
        case 'currentTime':
            if(changedValue) {
                this.__public__.emit('timeupdate');
            }
            break;
        case 'paused':
            if(becameTrue) {
                this.__public__.emit('pause');
            }
            if(becameFalse) {
                this.__public__.emit('play');
                this.__public__.emit('playing');
            }
            break;
        case 'volume':
            if(changedValue) {
                this.__public__.emit('volumechange');
            }
            break;
        }
        this.state[key] = value;
    }

    updateState() {
        if(this.vzPlayer) {
            this.vzPlayer.getTime(time => {
                this.setState('currentTime', time);
            });
            this.vzPlayer.getTotalTime(time => {
                this.setState('duration', time);
            });
            this.vzPlayer.getVolume(vol => {
                const MAX_VOLUME = 5;
                this.setState('volume', vol / MAX_VOLUME);
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
            _(this).setState('currentTime', value);
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
            _(this).setState('muted', value);
            _(this).vzPlayer[value ? 'muteOn' : 'muteOff']();
        }
    }

    get volume() {
        return _(this).state.volume;
    }
    set volume(value) {
        if(_(this).vzPlayer) {
            _(this).setState('volume', value);
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
        _(this).loadEmbed().then(() => {
            _(this).loadingPromise = null;
            browser.test('autoplay').then(autoplayable => {
                if(autoplayable) {
                    this.emit('attemptPlay');
                    _(this).vzPlayer.play2();
                }
            });
        });
    }

    load() {
        _(this).loadEmbed().then(() => {
            _(this).loadingPromise = null;
        });
    }

    unload() {
        _(this).stopPolling();
        if(_(this).vzPlayer) {
            _(this).vzPlayer.removeEventListener('playState');
            _(this).vzPlayer.removeEventListener('interaction');
        }
        _(this).vzPlayer = null;
        _(this).loadedVideoId = null;
        _(this).state = extend(CLEAN_STATE);
        if(this.element && _(this).embedElement) {
            this.element.removeChild(_(this).embedElement);
            _(this).embedElement = null;
        }
    }

    reload() {
        this.unload();
        this.load();
    }

    minimize() {
        return noMethodError('minimize');
    }
}
