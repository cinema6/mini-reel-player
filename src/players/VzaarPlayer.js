import codeLoader from '../services/code_loader.js';
import urlParser from '../services/url_parser.js';
import Runner from '../../lib/Runner.js';
import ThirdPartyPlayer from './ThirdPartyPlayer.js';
import RunnerPromise from '../../lib/RunnerPromise.js';
import timer from '../../lib/timer.js';

const PLAY_RETRY_DELAY = 500;
const PLAY_NUM_RETRIES = 10;
const MAX_VOLUME = 5;

codeLoader.configure('vzaar', {
    src: urlParser.parse('//player.vzaar.com/libs/flashtakt/client.js').href,
    after() {
        return global.vzPlayer;
    }
});

export default class VzaarPlayer extends ThirdPartyPlayer {
    constructor() {
        super(...arguments);

        this.__api__.name = 'VzaarPlayer';

        this.__api__.loadPlayer = src => {
            // Create the Vzaar embed code
            let embed = require('../../src/views/video_embeds/VzaarEmbedView.html');
            embed = embed.replace(/{{videoId}}/g, src).replace(/{{viewId}}/g, this.id);

            // Create the element containing the embed code
            const div = document.createElement('div');
            div.innerHTML = embed;

            return new RunnerPromise((resolve, reject) => {
                Runner.schedule('afterRender', this, () => {
                    this.element.appendChild(div);
                    codeLoader.load('vzaar').then(VzPlayer => {
                        const api = new VzPlayer(this.id + '_vzvd-' + src);
                        api.ready(() => process.nextTick(() => Runner.run(() => {
                            resolve(api);
                        })));
                    }).catch(error => {
                        reject(error);
                    });
                });
            });
        };

        this.__api__.methods = {
            play: api => {
                const attemptPlay = () => {
                    api.play2();
                    return !this.paused || this.buffering;
                };
                return new RunnerPromise((resolve, reject) => {
                    if(attemptPlay()) {
                        resolve();
                    } else {
                        let numAttempts = 0;
                        const interval = timer.interval(() => {
                            if(attemptPlay()) {
                                timer.cancel(interval);
                                resolve();
                            } else {
                                numAttempts++;
                                if(numAttempts >= PLAY_NUM_RETRIES) {
                                    timer.cancel(interval);
                                    reject('failed to confirm play');
                                }
                            }
                        }, PLAY_RETRY_DELAY);
                    }
                });
            },
            pause: api => {
                api.pause();
            },
            seek: (api, time) => {
                api.seekTo(time);
            },
            volume: (api, vol) => {
                api.setVolume(vol * MAX_VOLUME);
            },
            unload: () => {
                Runner.schedule('afterRender', this, () => {
                    this.element.innerHTML = '';
                });
            },
            addEventListener: (api, name, handler) => {
                api.addEventListener(name, (...args) => process.nextTick(() => {
                    Runner.run(() => handler(...args));
                }));
            },
            removeEventListener: (api, name) => {
                api.removeEventListener(name);
            }
        };

        this.__api__.events = {
            playState: state => {
                switch(state) {
                case 'mediaStarted':
                    this.__setProperty__('ended', false);
                    break;
                case 'mediaPaused':
                    this.__setProperty__('paused', true);
                    break;
                case 'mediaPlaying':
                    this.__setProperty__('paused', false);
                    this.__setProperty__('ended', false);
                    break;
                case 'mediaEnded':
                    this.__setProperty__('ended', true);
                    this.__setProperty__('paused', true);
                    break;
                }
            },
            interaction: interaction => {
                switch (interaction) {
                case 'pause':
                    this.__setProperty__('paused', true);
                    break;
                case 'resume':
                    this.__setProperty__('paused', false);
                    this.__setProperty__('ended', false);
                    break;
                case 'soundOn':
                    this.__setProperty__('muted', false);
                    break;
                case 'soundOff':
                    this.__setProperty__('muted', true);
                    break;
                }
            }
        };

        this.__api__.onReady = api => {
            api.getTotalTime(duration => Runner.run(() => {
                this.__setProperty__('duration', duration);
            }));
        };

        this.__api__.pollingDelay = 250;
        this.__api__.onPoll = api => {
            api.getTime(time => Runner.run(() => {
                this.__setProperty__('currentTime', time);
            }));
            api.getVolume(vol => Runner.run(() => {
                this.__setProperty__('volume', vol / MAX_VOLUME);
            }));
        };
    }
}
