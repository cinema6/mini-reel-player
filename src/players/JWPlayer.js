import Runner from '../../lib/Runner.js';
import { defer } from '../../lib/utils.js';
import ThirdPartyPlayer from './ThirdPartyPlayer.js';
import RunnerPromise from '../../lib/RunnerPromise.js';

export default class JWPlayer extends ThirdPartyPlayer {
    constructor() {
        super(...arguments);

        this.__api__.name = 'JWPlayer';
        this.__api__.loadPlayer = src => {
            const deferred = defer(RunnerPromise);
            const id = 'botr_' + src.replace('-', '_') + '_div';
            const iframe = document.createElement('iframe');

            const div = document.createElement('div');
            div.id = id;

            const style = document.createElement('style');
            style.innerHTML = `
                div#${id} {
                    width: 100% !important; height: 100% !important;
                }
            `;

            const script = document.createElement('script');
            script.setAttribute('type', 'application/javascript');
            script.setAttribute('src', '//content.jwplatform.com/players/' + src + '.js');
            script.addEventListener('load', () => {
                const jwplayer = iframe.contentWindow.jwplayer;
                const api = jwplayer(id);
                api.on('ready', () => {
                    deferred.fulfill(api);
                });
            });

            div.appendChild(script);
            iframe.addEventListener('load', () => {
                iframe.contentDocument.head.appendChild(style);
                iframe.contentDocument.body.appendChild(div);
            }, false);

            Runner.schedule('afterRender', null, () => {
                this.element.appendChild(iframe);
            });
            return deferred.promise;
        };
        this.__api__.methods = {
            unload: api => {
                api.stop();
                api.remove();
                Runner.schedule('afterRender', null, () => {
                    this.element.innerHTML = '';
                });
            },
            play: api => {
                api.play(true);
            },
            pause: api => {
                api.pause(true);
            },
            seek: (api, time) => {
                const deferred = defer(RunnerPromise);
                api.seek(time);
                this.once('seeked', () => {
                    deferred.fulfill();
                });
                setTimeout(() => {
                    deferred.reject('failed to confirm seek');
                }, 2000);
                return deferred.promise;
            },
            volume: (api, vol) => {
                api.setVolume(vol);
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
            time: data => {
                this.__setProperty__('duration', data.duration);
                this.__setProperty__('currentTime', data.position);
            },
            seek: () => {
                this.__setProperty__('seeking', true);
            },
            seeked: () => {
                this.__setProperty__('seeking', false);
            },
            setupError: data => {
                this.__setProperty__('error', data.message);
            },
            play: () => {
                this.__setProperty__('paused', false);
                this.__setProperty__('ended', false);
            },
            pause: () => {
                this.__setProperty__('paused', true);
            },
            complete: () => {
                this.__setProperty__('ended', true);
                this.__setProperty__('paused', true);
            },
            error: data => {
                this.__setProperty__('error', data.message);
            },
            mute: data => {
                this.__setProperty__('muted', data.mute);
            },
            volume: data => {
                this.__setProperty__('volume', data.volume);
            },
            fullscreen: data => {
                this.__setProperty__('minimized', data.fullscreen);
            },
            resize: data => {
                this.__setProperty__('width', data.width);
                this.__setProperty__('height', data.height);
            }
        };
    }
}
