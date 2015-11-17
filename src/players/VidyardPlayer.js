import Runner from '../../lib/Runner.js';
import ThirdPartyPlayer from './ThirdPartyPlayer.js';
import RunnerPromise from '../../lib/RunnerPromise.js';
import codeLoader from '../services/code_loader.js';
import urlParser from '../services/url_parser.js';

codeLoader.configure('vidyard', {
    src: urlParser.parse('//play.vidyard.com/v0/api.js').href,
    after() {
        return global.Vidyard;
    }
});

export default class VidyardPlayer extends ThirdPartyPlayer {
    constructor() {
        super(...arguments);

        this.__api__.name = 'Vidyard';
        this.__api__.loadPlayer = src => {
            const style = document.createElement('style');
            const script = document.createElement('script');

            style.innerHTML = `
                span#vidyard_span_${src} {
                    width: 100% !important; height: 100% !important;
                }
            `;
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('id', 'vidyard_embed_code_' + src);
            script.setAttribute('src', '//play.vidyard.com/' + src + '.js?v=3.1.1&type=inline');
            Runner.schedule('afterRender', null, () => {
                this.element.appendChild(style);
                this.element.appendChild(script);
            });
            return new RunnerPromise((resolve, reject) => {
                script.addEventListener('load', () => {
                    codeLoader.load('vidyard').then(Vidyard => {
                        const api = new Vidyard.player(src);
                        api.on('ready', () => {
                            resolve(api);
                        });
                    }).catch(error => {
                        reject(error);
                    });
                });
            });
        };
        this.__api__.methods = {
            play: api => {
                api.play();
            },
            pause: api => {
                api.pause();
            },
            unload: () => {
                Runner.schedule('afterRender', null, () => {
                    this.element.innerHTML = '';
                });
            },
            seek: (api, time) => {
                api.seek(time);
            },
            volume: (api, volume) => {
                api.setVolume(volume);
            },
            addEventListener: (api, name, handler) => {
                api.on(name, (...args) => process.nextTick(() => {
                    Runner.run(() => handler(...args));
                }));
            },
            removeEventListener: (api, name) => {
                api.off(name);
            }
        };

        this.__api__.events = {
            play: () => {
                this.__setProperty__('paused', false);
                this.__setProperty__('ended', false);
            },
            pause: () => {
                this.__setProperty__('paused', true);
            },
            beforeSeek: () => {
                this.__setProperty__('seeking', true);
            },
            seek: () => {
                this.__setProperty__('seeking', false);
            },
            playerComplete: () => {
                this.__setProperty__('ended', true);
                this.__setProperty__('paused', true);
            },
            timeupdate: time => {
                this.__setProperty__('currentTime', time);
            },
            volumeChange: volume => {
                this.__setProperty__('volume', volume);
            }
        };

        this.__api__.onReady = api => {
            /* jshint camelcase:false */
            this.__setProperty__('duration', api.metadata.length_in_seconds);
            /* jshint camelcase:true */
        };
    }
}
