import {createKey} from 'private-parts';
import browser from '../services/browser.js';
import RunnerPromise from '../../lib/RunnerPromise.js';
import CorePlayer from './CorePlayer.js';
import Observable from '../utils/Observable.js';
import PromiseSerializer from '../utils/PromiseSerializer.js';

// readyState constants
const HAVE_NOTHING = 0;
const HAVE_METADATA = 1;
const HAVE_FUTURE_DATA = 3;
const HAVE_ENOUGH_DATA = 4;

// internal player properties
const PLAYER_PROPERTIES = ['currentTime', 'paused', 'duration', 'readyState', 'muted', 'volume',
    'seeking', 'minimized', 'width', 'height', 'ended', 'error'];

// fallback return values when retrieving a player property
const DEFAULT_PLAYER_PROPERTIES = {
    currentTime: 0,
    paused: true,
    duration: 0,
    readyState: HAVE_NOTHING,
    muted: false,
    volume: 0,
    seeking: false,
    minimized: false,
    width: 0,
    height: 0,
    error: null,
    ended: false
};

function noMethodError(name, method) {
    return new Error(`${name} cannot ${method}.`);
}

class Private {
    constructor(instance) {
        this.__public__ = instance;
        this.src = null;
        this.api = null;
        this.eventListeners = [];
        this.serializer = new PromiseSerializer(RunnerPromise);
        const observableConfig = {};
        PLAYER_PROPERTIES.forEach(property => {
            observableConfig[property] = null;
        });
        this.approximateState = new Observable(observableConfig);
        this.approximateState.on('change:currentTime', () => {
            this.__public__.emit('timeupdate');
        });
        this.approximateState.on('becameTrue:paused', () => {
            this.__public__.emit('pause');
        });
        this.approximateState.on('becameFalse:paused', () => {
            this.__public__.emit('play');
            this.__public__.emit('playing');
        });
        this.approximateState.on('change:duration', () => {
            this.__public__.emit('durationchange');
        });
        this.approximateState.on('change:readyState', newValue => {
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
        this.approximateState.on('change:volume', () => {
            this.__public__.emit('volumechange');
        });
        this.approximateState.on('becameTrue:seeking', () => {
            this.__public__.emit('seeking');
        });
        this.approximateState.on('becameFalse:seeking', () => {
            this.__public__.emit('seeked');
        });
        this.approximateState.on('change:width', () => {
            this.__public__.emit('resize');
        });
        this.approximateState.on('change:height', () => {
            this.__public__.emit('resize');
        });
        this.approximateState.on('becameTrue:ended', () => {
            this.__public__.emit('ended');
        });
        this.approximateState.on('becameFalse:ended', () => {
            this.__public__.emit('playing');
        });
    }

    callPlayerMethod(methodName, args = []) {
        const fns = this.__public__.__api__.methods;
        if(fns[methodName]) {
            if(methodName === 'load') {
                return fns.load(...args);
            } else if(this.api) {
                return RunnerPromise.resolve(fns[methodName](this.api, ...args));
            } else {
                return RunnerPromise.reject(`cannot call ${methodName} as there is no api`);
            }
        } else {
            return RunnerPromise.reject(`${methodName} not implemented`);
        }
    }

    getPlayerProperty(property) {
        const getterFns = this.__public__.__api__.properties;
        if(PLAYER_PROPERTIES.indexOf(property) !== -1) {
            if(getterFns && getterFns[property] && this.api) {
                const value = getterFns[property](this.api);
                this.approximateState.set(property, value);
                return value;
            } else if(this.approximateState.get(property) !== null) {
                return this.approximateState.get(property);
            } else {
                return DEFAULT_PLAYER_PROPERTIES[property];
            }
        }
    }

    addEventListeners() {
        const handlerFns = this.__public__.__api__.events;
        const listeners = [];
        for(let eventName in handlerFns) {
            const handlerFn = handlerFns[eventName];
            listeners.push({
                name: eventName,
                handler: handlerFn
            });
        }
        return RunnerPromise.all(listeners.map(listener => {
            return this.callPlayerMethod('addEventListener',
                [listener.name, listener.handler]);
        })).then(() => {
            this.eventListeners = listeners;
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
            return this.callPlayerMethod('load', [this.src]).then(api => {
                this.api = api;
                this.approximateState.set('readyState', HAVE_FUTURE_DATA);
                return this.addEventListeners();
            });
        } else {
            return RunnerPromise.resolve();
        }
    }

    playerPlay() {
        if(this.api) {
            return this.callPlayerMethod('play');
        } else {
            return this.playerLoad().then(() => {
                if(this.__public__.__api__.autoplayTest) {
                    return browser.test('autoplay');
                } else {
                    return true;
                }
            }).then(autoplayable => {
                if(autoplayable) {
                    return this.callPlayerMethod('play');
                }
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
            return this.removeEventListeners().then(() => {
                return this.callPlayerMethod('unload');
            }).then(() => {
                this.api = null;
                this.approximateState.reset();
            });
        } else {
            return RunnerPromise.resolve();
        }
    }

    playerSeek(position) {
        if(this.api) {
            const wasPaused = this.getPlayerProperty('paused');
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
}

const _ = createKey(instance => new Private(instance));

export default class ThirdPartyPlayer extends CorePlayer {
    constructor() {
        super(...arguments);
        this.__api__ = {
            name: '',
            methods: {},
            properties: {},
            events: {},
            autoplayTest: true
        };
        if (global.__karma__) { this.__private__ = _(this); }
    }

    __setProperty__(property, value) {
        if(PLAYER_PROPERTIES.indexOf(property) !== -1) {
            _(this).approximateState.set(property, value);
        }
    }

    load() {
        if(this.__api__.methods.load) {
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
                return _(this).playerUnload();
            });
        } else {
            return noMethodError(this.__api__.name, 'unload');
        }
    }

    reload() {
        if(this.__api__.methods.load && this.__api__.methods.unload) {
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
        return _(this).getPlayerProperty('currentTime');
    }

    set currentTime(val) {
        _(this).serializer.call(() => {
            return _(this).playerSeek(val);
        });
    }

    get volume() {
        return _(this).getPlayerProperty('volume');
    }

    set volume(val) {
        _(this).serializer.call(() => {
            return _(this).playerVolume(val);
        });
    }

    get paused() {
        return _(this).getPlayerProperty('paused');
    }

    get duration() {
        return _(this).getPlayerProperty('duration');
    }

    get ended() {
        return _(this).getPlayerProperty('ended');
    }

    get muted() {
        return _(this).getPlayerProperty('muted');
    }

    get readyState() {
        return _(this).getPlayerProperty('readyState');
    }

    get seeking() {
        return _(this).getPlayerProperty('seeking');
    }

    get error() {
        return _(this).getPlayerProperty('error');
    }
}
