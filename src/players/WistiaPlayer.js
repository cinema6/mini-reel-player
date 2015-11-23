import codeLoader from '../services/code_loader.js';
import urlParser from '../services/url_parser.js';
import Runner from '../../lib/Runner.js';
import RunnerPromise from '../../lib/RunnerPromise.js';
import ThirdPartyPlayer from './ThirdPartyPlayer.js';

const WISTIA_EMBED_OPTIONS = {
    playerPreference: 'html5',
    volume: 1
};

codeLoader.configure('wistia', {
    src: urlParser.parse('//fast.wistia.net/assets/external/E-v1.js').href,
    after() {
        return global.Wistia;
    }
});

export default class WistiaPlayer extends ThirdPartyPlayer {
    constructor() {
        super(...arguments);

        this.__api__.name = 'WistiaPlayer';

        this.__api__.loadPlayer = src => {
            // Create the Wistia iframe
            const template = require('../../src/views/video_embeds/WistiaEmbedTemplate.html');
            const params = Object.keys(WISTIA_EMBED_OPTIONS).map(key => {
                return key + '=' + WISTIA_EMBED_OPTIONS[key];
            }).join('&');
            const embed = template.replace(/{{videoId}}/g, src)
                .replace(/{{params}}/g, params);
            const div = document.createElement('div');
            div.innerHTML = embed;
            const iframe = div.firstChild;

            // Append to the player element
            Runner.schedule('afterRender', this.element, 'appendChild', [iframe]);

            return new RunnerPromise((resolve, reject) => {
                iframe.addEventListener('load', () => {
                    codeLoader.load('wistia').then(Wistia => {
                        Wistia.reinitialize();
                        const api = iframe.wistiaApi;
                        api.ready(() => process.nextTick(() => Runner.run(() => {
                            resolve(api);
                        })));
                    }).catch(error => {
                        reject(error);
                    });
                }, false);
            });
        };

        this.__api__.methods = {
            unload: () => {
                Runner.schedule('afterRender', this.element, 'removeChild',
                    [this.element.firstChild]);
            },
            seek: (api, time) => {
                api.time(time);
            },
            volume: (api, vol) => {
                api.volume(vol);
            },
            pause: api => {
                api.pause();
            },
            play: api => {
                api.play();
            },
            addEventListener: (api, name, handler) => {
                api.bind(name, (...args) => process.nextTick(() => {
                    Runner.run(() => handler(...args));
                }));
            },
            removeEventListener: (api, name) => {
                api.unbind(name);
            }
        };

        this.__api__.events = {
            end: () => {
                this.__setProperty__('ended', true);
                this.__setProperty__('paused', true);
            },
            pause: () => {
                this.__setProperty__('paused', true);
            },
            play: () => {
                this.__setProperty__('paused', false);
                this.__setProperty__('ended', false);
            },
            seek: () => {
                this.__setProperty__('seeking', true);
                this.__setProperty__('seeking', false);
            },
            timechange: time => {
                this.__setProperty__('currentTime', time);
            },
            volumechange: volume => {
                this.__setProperty__('volume', volume);
            },
            widthchange: width => {
                this.__setProperty__('width', width);
            },
            heightchange: height => {
                this.__setProperty__('height', height);
            }
        };

        this.__api__.onReady = api => {
            this.__setProperty__('duration', api.duration());
        };
    }
}
