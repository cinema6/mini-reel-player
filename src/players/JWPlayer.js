import CorePlayer from './CorePlayer.js';
import Runner from '../../lib/Runner.js';
import { defer } from '../../lib/utils.js';
import ThirdPartyPlayer from '../../src/mixins/ThirdPartyPlayer.js';
import RunnerPromise from '../../lib/RunnerPromise.js';

class JWPlayer extends CorePlayer {
    constructor() {
        super(...arguments);
        
        this.playerName = 'JWPlayer';
        this.playerMethods = {
            load: src => {
                const deferred = defer(RunnerPromise);
                const id = 'botr_' + src.replace('-', '_') + '_div';
                const iframe = document.createElement('iframe');
                const div = document.createElement('div');
                div.id = id;
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
                Runner.schedule('afterRender', null, () => {
                    this.element.appendChild(iframe);
                    iframe.contentDocument.body.appendChild(div);
                });
                return deferred.promise;
            },
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
                api.seek(time);
                const deferred = defer(RunnerPromise);
                this.once('seeked', () => Runner.run(() => {
                    deferred.fulfill();
                }));
                setTimeout(() => {
                    deferred.reject('failed to confirm seek');
                }, 5000);
                return deferred.promise;
            },
            volume: (api, vol) => {
                api.setVolume(vol);
            },
            addEventListener: (api, name, handler) => {
                api.on(name, handler);
            },
            removeEventListener: (api, name) => {
                api.off(name);
            }
        };
        this.playerPropertyGetters = {
            currentTime: api => {
                return api.getPosition();
            },
            paused: api => {
                return (api.getState() !== 'playing');
            },
            duration: api => {
                return api.getDuration();
            },
            muted: api => {
                return api.getMute();
            },
            volume: api => {
                return api.getVolume();
            },
            minimized: api => {
                return api.getFullscreen();
            },
            width: api => {
                return api.getWidth();
            },
            height: api => {
                return api.getHeight();
            }
        };
        this.apiEventHandlers = {
            time: time => {
                this.setEventDrivenProperty('duration', time.duration);
                this.setEventDrivenProperty('currentTime', time.position);
            },
            seek: () => {
                this.setEventDrivenProperty('seeking', true);
            },
            seeked: () => {
                this.setEventDrivenProperty('seeking', false);
            },
            setupError: message => {
                this.setEventDrivenProperty('error', message);
            },
            play: () => {
                this.setEventDrivenProperty('paused', false);
            },
            pause: () => {
                this.setEventDrivenProperty('paused', true);
            },
            complete: () => {
                this.setEventDrivenProperty('ended', true);
            },
            error: message => {
                this.setEventDrivenProperty('error', message);
            },
            mute: muted => {
                this.setEventDrivenProperty('muted', muted);
            },
            volume: volume => {
                this.setEventDrivenProperty('volume', volume);
            }
        };

        window.wubalub = this;
    }
}
JWPlayer.mixin(ThirdPartyPlayer);
export default JWPlayer;
