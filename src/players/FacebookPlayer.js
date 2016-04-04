import Runner from '../../lib/Runner.js';
import RunnerPromise from '../../lib/RunnerPromise.js';
import ThirdPartyPlayer from './ThirdPartyPlayer.js';
import codeLoader from '../services/code_loader.js';
import {createKey} from 'private-parts';
import {noop} from '../../lib/utils.js';
import timer from '../../lib/timer.js';

const API_POLL_INTERVAL = 250;
const BLACK_COLOR = '#0E0F12';
const LOAD_POLL_INTERVAL = 250;
const FB_APP_ID = '1675390956067908';
const FB_SDK_VERSION = 'v2.5';
const LOAD_TIMEOUT = 60000;

codeLoader.configure('facebook', {
    src: `https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=${FB_SDK_VERSION}`,
    after() {
        const sdk = global.FB;
        sdk.init({
            appId: FB_APP_ID,
            version: FB_SDK_VERSION
        });
        return sdk;
    }
});

class Private {
    constructor(instance) {
        this.__public__ = instance;
    }

    waitForPlayer(elementId, sdk) {
        return new RunnerPromise((resolve, reject) => {
            let loadInterval = null;
            const timeout = setTimeout(() => {
                if(loadInterval) {
                    timer.cancel(loadInterval);
                }
                sdk.Event.unsubscribe('xfbml.ready');
                reject('Failed to load video');
            }, LOAD_TIMEOUT);
            sdk.Event.subscribe('xfbml.ready', message => Runner.run(() => {
                if(message.type === 'video' && message.id === elementId) {
                    const api = message.instance;
                    loadInterval = timer.interval(() => {
                        const duration = api.getDuration();
                        if(duration !== 0) {
                            clearTimeout(timeout);
                            timer.cancel(loadInterval);
                            sdk.Event.unsubscribe('xfbml.ready');
                            resolve(api);
                        }
                    }, LOAD_POLL_INTERVAL);
                }
            }));
        });
    }
}

const _ = createKey(instance => new Private(instance));

export default class FacebookPlayer extends ThirdPartyPlayer {
    constructor() {
        super(...arguments);

        const _private = _(this);
        if (global.__karma__) {
            this.__private__ = _private;
        }

        this.__api__.name = 'FacebookPlayer';
        this.__api__.loadPlayer = src => {
            const videoId = (src.match(/\d+/) || ['0'])[0];
            const elementId = `fb-video-${videoId}`;

            // Get Facebook video HTML
            const embedTemplate = require('../views/video_embeds/FacebookEmbed.html');
            const embed = embedTemplate.replace('{{elementId}}', elementId)
                .replace('{{src}}', src);

            // Append to the player element
            Runner.schedule('afterRender', this, () => this.element.innerHTML = embed);

            // Load the facebook sdk
            return codeLoader.load('facebook', document.body, 'insertBefore',
                document.body.firstChild).then(sdk => {
                sdk.XFBML.parse(this.element);
                return _private.waitForPlayer(elementId, sdk);
            });
        };

        this.__api__.methods = {
            seek: (api, time) => {
                api.seek(time);
            },
            play: api => {
                api.play();
            },
            pause: api => {
                api.pause();
            },
            unload: () => {
                Runner.schedule('afterRender', this.element, 'removeChild',
                    [this.element.firstChild]);
            },
            addEventListener: (api, name, handler) => {
                api.subscribe(name,  (...args) => Runner.run(() => handler(...args)));
            },
            removeEventListener: noop
        };

        this.__api__.events = {
            startedPlaying: () => {
                this.__setProperty__('paused', false);
                this.__setProperty__('ended', false);
            },
            paused: () => {
                this.__setProperty__('paused', true);
            },
            finishedPlaying: () => {
                this.__setProperty__('ended', true);
                this.__setProperty__('paused', true);
            },
            error: error => {
                this.__setProperty__('error', error);
            }
        };

        this.__api__.onReady = api => {
            this.element.firstChild.style['background-color'] = BLACK_COLOR;
            this.__setProperty__('duration', api.getDuration());
        };

        this.__api__.pollingDelay = API_POLL_INTERVAL;
        this.__api__.onPoll = api => {
            this.__setProperty__('currentTime', api.getCurrentPosition());
            this.__setProperty__('volume', api.getVolume());
            this.__setProperty__('muted', (api.getVolume() === 0));
        };
    }
}
