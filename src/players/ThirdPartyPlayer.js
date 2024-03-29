import {createKey} from 'private-parts';
import {noop} from '../../lib/utils.js';
import browser from '../services/browser.js';
import RunnerPromise from '../../lib/RunnerPromise.js';
import CorePlayer from './CorePlayer.js';
import Observable from '../utils/Observable.js';
import PromiseSerializer from '../utils/PromiseSerializer.js';
import timer from '../../lib/timer.js';

// readyState constants
const HAVE_NOTHING = 0;
const HAVE_METADATA = 1;
const HAVE_FUTURE_DATA = 3;
const HAVE_ENOUGH_DATA = 4;

// internal player properties
const PLAYER_PROPERTIES = ['currentTime', 'paused', 'duration', 'readyState', 'muted', 'volume',
    'seeking', 'minimized', 'width', 'height', 'ended', 'error', 'controls'];

// defaults
const DEFAULT_PLAYER_PROPERTIES = {
    currentTime: 0,
    buffering: false,
    paused: true,
    duration: 0,
    readyState: HAVE_NOTHING,
    muted: false,
    volume: 1,
    seeking: false,
    minimized: false,
    width: 0,
    height: 0,
    error: null,
    ended: false,
    controls: true
};

function noMethodError(name, method) {
    return new Error(`${name} cannot ${method}.`);
}

class Private {
    constructor(instance) {
        this.__public__ = instance;
        this.src = null;
        this.api = null;
        this.pollingInterval = null;
        this.eventListeners = [];
        this.serializer = new PromiseSerializer(RunnerPromise);
        this.state = new Observable(DEFAULT_PLAYER_PROPERTIES);
        this.hasPlayed = false;

        this.state.on('change:buffering', buffering => {
            if (buffering) {
                this.__public__.emit('buffering');
            } else {
                this.__public__.emit('buffered');
            }
        });
        this.state.on('change:currentTime', () => {
            this.__public__.emit('timeupdate');
        });
        this.state.on('change:paused', newValue => {
            if(newValue === true) {
                this.__public__.emit('pause');
            } else if(newValue === false) {
                this.__public__.emit('play');
                this.__public__.emit('playing');
            }
        });
        this.state.on('change:duration', () => {
            this.__public__.emit('durationchange');

            if (this.state.get('readyState') < HAVE_METADATA) {
                this.state.set('readyState', HAVE_METADATA);
            }
        });
        this.state.on('change:readyState', newValue => {
            switch(newValue) {
            case HAVE_NOTHING:
                this.__public__.emit('emptied');
                break;
            case HAVE_METADATA:
                this.__public__.emit('loadedmetadata');
                break;
            case HAVE_FUTURE_DATA:
                this.__public__.emit('canplay');
                break;
            case HAVE_ENOUGH_DATA:
                this.__public__.emit('canplaythrough');
                break;
            }
        });
        this.state.on('change:volume', newValue => {
            this.__public__.emit('volumechange', newValue);
        });
        this.state.on('change:seeking', newValue => {
            if(newValue === true) {
                this.__public__.emit('seeking');
            } else if(newValue === false) {
                this.__public__.emit('seeked');
            }
        });
        this.state.on('change:width', () => {
            this.__public__.emit('resize');
        });
        this.state.on('change:height', () => {
            this.__public__.emit('resize');
        });
        this.state.on('change:ended', newValue => {
            if(newValue === true) {
                this.__public__.emit('ended');
            }
        });
    }

    callLoadPlayerMethod() {
        const loadFn = this.__public__.__api__.loadPlayer;
        if(loadFn) {
            this.__public__.emit('loadstart');
            return RunnerPromise.resolve(loadFn(this.src, this.__public__.poster));
        } else {
            return RunnerPromise.reject(`load not implemented`);
        }
    }

    callPlayerMethod(methodName, args = []) {
        const fns = this.__public__.__api__.methods;
        if(fns[methodName]) {
            if(this.api) {
                return RunnerPromise.resolve(fns[methodName](this.api, ...args));
            } else {
                return RunnerPromise.reject(`cannot call ${methodName} as there is no api`);
            }
        } else {
            return RunnerPromise.reject(`${methodName} not implemented`);
        }
    }

    startPolling() {
        const delay = this.__public__.__api__.pollingDelay;
        if(delay && !this.pollingInterval) {
            this.pollingInterval = timer.interval(() => this.__public__.__api__.onPoll(this.api),
                delay);
        }
    }

    stopPolling() {
        if(this.pollingInterval) {
            timer.cancel(this.pollingInterval);
            this.pollingInterval = null;
        }
    }

    addEventListeners() {
        const handlerFns = this.__public__.__api__.events;
        const eventNames = Object.keys(handlerFns);
        return RunnerPromise.all(eventNames.map(eventName => {
            const handlerFn = handlerFns[eventName];
            return this.callPlayerMethod('addEventListener', [eventName, handlerFn]);
        })).then(results => {
            this.eventListeners = results.map((handler, index) => {
                return {
                    name: eventNames[index],
                    handler: handler
                };
            });
        });
    }

    removeEventListeners() {
        return RunnerPromise.all(this.eventListeners.map(listener => {
            return this.callPlayerMethod('removeEventListener', [listener.name, listener.handler]);
        })).then(() => {
            this.eventListeners = [];
        });
    }

    playerLoad() {
        if(this.src && this.src !== '' && !this.api) {
            return this.callLoadPlayerMethod().then(api => {
                this.api = api;

                this.startPolling();
                return this.addEventListeners();
            }).then(() => {
                if (this.__public__.prebuffer) { return this.playerBuffer(); }
            }).then(() => {
                const setReadyState = (() => this.state.set('readyState', HAVE_FUTURE_DATA));

                this.__public__.__api__.onReady(this.api);

                if (this.state.get('readyState') >= HAVE_METADATA) {
                    setReadyState();
                } else {
                    this.state.once('change:duration', setReadyState);
                }
            });
        } else {
            return RunnerPromise.resolve();
        }
    }

    playerPlay() {
        const callPlay = () => {
            this.__public__.emit('attemptPlay');
            return this.callPlayerMethod('play');
        };

        const attemptPlay = () => {
            if(this.hasPlayed || !this.__public__.__api__.autoplayTest) {
                return callPlay();
            } else {
                return browser.test('autoplay').then(autoplayable => {
                    if(autoplayable) {
                        return callPlay();
                    }
                });
            }
        };

        if(this.api) {
            return attemptPlay();
        } else {
            return this.playerLoad().then(() => {
                return attemptPlay();
            });
        }
    }

    playerPause() {
        if(this.api) {
            return this.callPlayerMethod('pause');
        } else {
            return this.playerLoad();
        }
    }

    playerUnload() {
        if(this.api) {
            this.stopPolling();
            return this.removeEventListeners().then(() => {
                return this.callPlayerMethod('unload');
            }).then(() => {
                this.state.set('readyState', HAVE_NOTHING);
                this.api = null;
                this.state.reset();
            });
        } else {
            return RunnerPromise.resolve();
        }
    }

    playerSeek(position) {
        if(this.api) {
            const wasPaused = this.state.get('paused');
            return this.callPlayerMethod('seek', [position])
                .then(() => {
                    return this[(wasPaused)?'playerPause':'playerPlay']();
                });
        } else {
            return RunnerPromise.resolve();
        }
    }

    playerVolume(volume) {
        if(this.api) {
            return this.callPlayerMethod('volume', [volume]);
        } else {
            return RunnerPromise.resolve();
        }
    }

    playerMinimize() {
        if(this.api) {
            return this.callPlayerMethod('minimize');
        } else {
            return RunnerPromise.resolve();
        }
    }

    playerControls(showControls) {
        return (this.api ? RunnerPromise.resolve() : RunnerPromise.reject())
            .then(() => this.callPlayerMethod('controls', [showControls]))
            .catch(() => this.state.set('controls', showControls));
    }

    playerBuffer() {
        if (!this.api) { return RunnerPromise.resolve(); }

        this.state.set('buffering', true);

        return this.callPlayerMethod('buffer').catch(() => {
            this.state.mutable(false);

            return browser.test('autoplay').then(autoplayable => {
                if (!autoplayable) { return; }

                this.playerVolume(0);
                this.playerPlay();

                return new RunnerPromise(resolve => {
                    this.state.once('reject:paused', () => resolve());
                }).then(() => this.playerPause()).then(() => {
                    return this.playerVolume(1);
                });
            }).then(() => this.state.mutable(true));
        }).then(() => this.state.set('buffering', false));
    }
}

const _ = createKey(instance => new Private(instance));

/**
    Set properties on this __api__ object to implement a third party player.
    Explanation of properties:
    name:
        The name of the third party player

    methods:
        An object of implemented api methods. The values for the keys must be functions which
        implement the given api method. Each of these functions is passed a reference to the third
        party player's api and may return a promise signifying that the action is complete. The
        load implementation is special. The load function takes a src as a parameter and must
        return a promise resolved with the third party player's api when the player is loaded,
        ready, and able to play.
        Supported methods:
            play, pause, load, unload, seek, volume, minimize, addEventListener
            removeEventListener, controls

    events:
        An object of implemented api events. The keys of this object correspond to events fired by
        the third party player. The values of these keys are the event handlers, passed any
        arguments that would normally be given to a handler of the implemented event. Within these
        handlers __setProperty__ should be called to update this class' knoledge of changes to
        properties signaled by the event.

    autoplayTest:
        A boolean indicating whether the browser should be tested for autoplayability before
        autoplaying a player.
*/
export default class ThirdPartyPlayer extends CorePlayer {
    constructor() {
        super(...arguments);

        this.prebuffer = false;

        this.__api__ = {
            name: '',
            loadPlayer: null,
            methods: {},
            events: {},
            autoplayTest: true,
            onReady: noop,
            pollingDelay: null,
            onPoll: noop,
            singleUse: false
        };

        this.on('playing', () => {
            _(this).hasPlayed = true;
        });
        this.on('emptied', () => {
            _(this).hasPlayed = false;
        });
        this.on('ended', () => {
            if (this.__api__.singleUse) { this.unload(); }
        });

        if (global.__karma__) { this.__private__ = _(this); }
    }

    __setProperty__(property, value) {
        if(PLAYER_PROPERTIES.indexOf(property) !== -1) {
            _(this).state.set(property, value);
        } else {
            throw new Error(`Cannot set invalid property ${property}`);
        }
    }

    load() {
        if(this.__api__.loadPlayer) {
            _(this).serializer.call(() => {
                return _(this).playerLoad();
            });
        } else {
            return noMethodError(this.__api__.name, 'load');
        }
    }

    play() {
        if(this.__api__.methods.play) {
            _(this).serializer.call(() => {
                return _(this).playerPlay();
            });
        } else {
            return noMethodError(this.__api__.name, 'play');
        }
    }

    pause() {
        if(this.__api__.methods.pause) {
            _(this).serializer.call(() => {
                return _(this).playerPause();
            });
        } else {
            return noMethodError(this.__api__.name, 'pause');
        }
    }

    unload() {
        if(this.__api__.methods.unload) {
            _(this).serializer.call(() => {
                super.unload();
                return _(this).playerUnload();
            });
        } else {
            return noMethodError(this.__api__.name, 'unload');
        }
    }

    reload() {
        if(this.__api__.loadPlayer && this.__api__.methods.unload) {
            this.unload();
            this.load();
        } else {
            return noMethodError(this.__api__.name, 'reload');
        }
    }

    minimize() {
        if(this.__api__.methods.minimize) {
            _(this).serializer.call(() => {
                return _(this).playerMinimize();
            });
        } else {
            return noMethodError(this.__api__.name, 'minimize');
        }
    }

    get src() {
        return _(this).src;
    }

    set src(val) {
        if(_(this).src !== val) {
            this.unload();
        }
        _(this).src = val;
    }

    get currentTime() {
        return _(this).state.get('currentTime');
    }

    set currentTime(val) {
        _(this).serializer.call(() => {
            return _(this).playerSeek(val);
        });
    }

    get volume() {
        return _(this).state.get('volume');
    }

    set volume(val) {
        _(this).serializer.call(() => {
            return _(this).playerVolume(val);
        });
    }

    get buffering() {
        return _(this).state.get('buffering');
    }

    get paused() {
        return _(this).state.get('paused');
    }

    get duration() {
        return _(this).state.get('duration');
    }

    get ended() {
        return _(this).state.get('ended');
    }

    get muted() {
        return _(this).state.get('muted');
    }

    get readyState() {
        return _(this).state.get('readyState');
    }

    get seeking() {
        return _(this).state.get('seeking');
    }

    get error() {
        return _(this).state.get('error');
    }

    get controls() {
        return _(this).state.get('controls');
    }

    set controls(val) {
        _(this).serializer.call(() => {
            return _(this).playerControls(val);
        });
    }
}
