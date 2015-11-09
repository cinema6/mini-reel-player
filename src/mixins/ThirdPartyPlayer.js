import {createKey} from 'private-parts';
import browser from '../../src/services/browser.js';
import RunnerPromise from '../../lib/RunnerPromise.js';

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
        this.pendingOperation = RunnerPromise.resolve();
        this.approximateState = {};
        const approximateState = {};
        const setters = {
            currentTime: val => {
                const changed = (val !== null && approximateState.currentTime !== val);
                approximateState.currentTime = val;
                if(changed) {
                    this.__public__.emit('timeupdate');
                }
            },
            paused: val => {
                const changed = (val !== null && approximateState.paused !== val);
                approximateState.paused = val;
                if(changed && val === true) {
                    this.__public__.emit('pause');
                }
                if(changed && val === false) {
                    this.__public__.emit('play');
                    this.__public__.emit('playing');
                }
            },
            duration: val => {
                const changed = (val !== null && approximateState.duration !== val);
                approximateState.duration = val;
                if(changed) {
                    this.__public__.emit('durationchange');
                }
            },
            readyState: val => {
                const changed = (val !== null && approximateState.readyState !== val);
                approximateState.readyState = val;
                if(changed && val === HAVE_NOTHING) {
                    this.__public__.emit('emptied');
                } else if(changed && val === HAVE_METADATA) {
                    this.__public__.emit('loadedmetadata');
                } else if(changed && val === HAVE_FUTURE_DATA) {
                    this.__public__.emit('canplay');
                } else if(changed && HAVE_ENOUGH_DATA) {
                    this.__public__.emit('canplaythrough');
                }
            },
            muted: val => {
                approximateState.muted = val;
            },
            volume: val => {
                const changed = (val !== null && approximateState.volume !== val);
                approximateState.volume = val;
                if(changed) {
                    this.__public__.emit('volumechange');
                }
            },
            seeking: val => {
                const changed = (val !== null && approximateState.seeking !== val);
                approximateState.seeking = val;
                if(changed && val === true) {
                    this.__public__.emit('seeking');
                }
                if(changed && val === false) {
                    this.__public__.emit('seeked');
                }
            },
            minimized: val => {
                approximateState.minimized = val;
            },
            width: val => {
                const changed = (val !== null && approximateState.seeking !== val);
                approximateState.width = val;
                if(changed) {
                    this.__public__.emit('resize');
                }
            },
            height: val => {
                const changed = (val !== null && approximateState.seeking !== val);
                approximateState.height = val;
                if(changed) {
                    this.__public__.emit('resize');
                }
            },
            ended: val => {
                const changed = (val !== null && approximateState.ended !== val);
                approximateState.ended = val;
                if(changed && val === true) {
                    this.__public__.emit('ended');
                }
                if(changed && val === false) {
                    this.__public__.emit('playing');
                }
            },
            error: val => {
                approximateState.error = val;
            }
        };
        PLAYER_PROPERTIES.forEach(property => {
            approximateState[property] = null;
            Object.defineProperty(this.approximateState, property, {
                get: () => {
                    return approximateState[property];
                },
                set: setters[property]
            });
        });
    }
    
    callPlayerMethod(methodName, args = []) {
        const fns = this.__public__.playerMethods;
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
        const getterFns = this.__public__.playerPropertyGetters;
        if(PLAYER_PROPERTIES.indexOf(property) !== -1) {
            if(getterFns && getterFns[property] && this.api) {
                const value = getterFns[property](this.api);
                this.approximateState[property] = value;
                return value;
            } else if(this.approximateState[property] !== null) {
                return this.approximateState[property];
            } else {
                return DEFAULT_PLAYER_PROPERTIES[property];
            }
        }
    }
    
    addEventListeners() {
        const handlerFns = this.__public__.apiEventHandlers;
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
                this.approximateState.readyState = HAVE_FUTURE_DATA;
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
                return browser.test('autoplay');
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
                for(let property in this.approximateState) {
                    this.approximateState[property] = null;
                }
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

function ThirdPartyPlayer() {
    this.playerName = '';
    this.playerMethods = {};
    this.playerPropertyGetters = {};
    this.apiEventHandlers = {};
    if (global.__karma__) { this.__private__ = _(this); }
}
ThirdPartyPlayer.prototype = {
    load() {
        if(this.playerMethods.load) {
            _(this).pendingOperation = _(this).pendingOperation.then(() => {
                return _(this).playerLoad();
            }).catch(() => {});
        } else {
            return noMethodError(this.playerName, 'load');
        }
    },

    play() {
        if(this.playerMethods.play) {
            _(this).pendingOperation = _(this).pendingOperation.then(() => {
                return _(this).playerPlay();
            }).catch(() => {});
        } else {
            return noMethodError(this.playerName, 'play');
        }
    },

    pause() {
        if(this.playerMethods.pause) {
            _(this).pendingOperation = _(this).pendingOperation.then(() => {
                return _(this).playerPause();
            }).catch(() => {});
        } else {
            return noMethodError(this.playerName, 'pause');
        }
    },

    unload() {
        if(this.playerMethods.unload) {
            _(this).pendingOperation = _(this).pendingOperation.then(() => {
                return _(this).playerUnload();
            }).catch(() => {});
        } else {
            return noMethodError(this.playerName, 'unload');
        }
    },

    reload() {
        if(this.playerMethods.load && this.playerMethods.unload) {
            this.unload();
            this.load();
        } else {
            return noMethodError(this.playerName, 'reload');
        }
    },

    minimize() {
        if(this.playerMethods.minimize) {
            _(this).pendingOperation = _(this).pendingOperation.then(() => {
                return _(this).playerMinimize();
            }).catch(() => {});
        } else {
            return noMethodError(this.playerName, 'minimize');
        }
    },
    
    setEventDrivenProperty(property, value) {
        if(PLAYER_PROPERTIES.indexOf(property) !== -1) {
            _(this).approximateState[property] = value;
        }
    }
};
Object.defineProperties(ThirdPartyPlayer.prototype, {
    src: {
        get: function() {
            return _(this).src;
        },
        set: function(val) {
            if(_(this).src !== val) {
                this.unload();
            }
            _(this).src = val;
        }
    },
    currentTime: {
        get: function() {
            return _(this).getPlayerProperty('currentTime');
        },
        set: function(val) {
            _(this).pendingOperation = _(this).pendingOperation.then(() => {
                return _(this).playerSeek(val);
            }).catch(() => {});
        }
    },
    volume: {
        get: function() {
            return _(this).getPlayerProperty('volume');
        },
        set: function(val) {
            _(this).pendingOperation = _(this).pendingOperation.then(() => {
                return _(this).playerVolume(val);
            }).catch(() => {});
        }
    },
    paused: {
        get: function() {
            return _(this).getPlayerProperty('paused');
        }
    },
    duration: {
        get: function() {
            return _(this).getPlayerProperty('duration');
        }
    },
    ended: {
        get: function() {
            return _(this).getPlayerProperty('ended');
        }
    },
    muted: {
        get: function() {
            return _(this).getPlayerProperty('muted');
        }
    },
    readyState: {
        get: function() {
            return _(this).getPlayerProperty('readyState');
        }
    },
    seeking: {
        get: function() {
            return _(this).getPlayerProperty('seeking');
        }
    },
    error: {
        get: function() {
            return _(this).getPlayerProperty('error');
        }
    }
});
export default ThirdPartyPlayer;
