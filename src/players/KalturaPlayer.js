import ThirdPartyPlayer from './ThirdPartyPlayer.js';
import codeLoader from '../services/code_loader.js';
import RunnerPromise from '../../lib/RunnerPromise.js';
import Runner from '../../lib/Runner.js';

export default class KalturaPlayer extends ThirdPartyPlayer {
    constructor() {
        super(...arguments);
        
        this.__api__.name = 'KalturaPlayer';
        
        this.__api__.loadPlayer = src => {
            const ids = JSON.parse(src);
            const random = Math.floor(Math.random() * 9000000000) + 1000000000;
            const containerId = `kaltura_player_${random}`;
            codeLoader.configure('kaltura', {
                src: `https://cdnapisec.kaltura.com/p/${ids.partnerid}/sp/${ids.partnerid}00/` +
                    `embedIframeJs/uiconf_id/${ids.playerid}/partner_id/${ids.partnerid}`,
                after() {
                    return global.kWidget;
                }
            });
            const div = document.createElement('div');
            div.setAttribute('id', containerId);
            return codeLoader.load('kaltura').then(Kaltura => {
                return new RunnerPromise(resolve => {
                    Runner.schedule('afterRender', null, () => {
                        this.element.appendChild(div);
                        Kaltura.embed({
                            targetId: containerId,
                            wid: `_${ids.partnerid}`,
                            /* jshint camelcase:false */
                            uiconf_id: ids.playerid,
                            /* jshint camelcase:true */
                            flashvars: {
                                autoPlay: false,
                                EmbedPlayer: {
                                    WebKitPlaysInline: true
                                },
                                KalturaSupport: {
                                    LeadWithHTML5: true
                                }
                            },
                            /* jshint camelcase:false */
                            cache_st: random.toString(),
                            entry_id: ids.videoid,
                            /* jshint camelcase:true */
                            readyCallback: playerId => {
                                const kdp = document.getElementById(playerId);
                                kdp.kBind('mediaReady', () => process.nextTick(() => {
                                    Runner.run(() => {
                                        kdp.kUnbind('mediaReady');
                                        resolve(kdp);
                                    });
                                }));
                            }
                        });
                    });
                });
            });
        };

        this.__api__.methods = {
            addEventListener: (api, name, handler) => {
                api.kBind(name, (...args) => process.nextTick(() => {
                    Runner.run(() => handler(...args));
                }));
            },
            removeEventListener: (api, name) => {
                api.kUnbind(name);
            },
            play: api => {
                api.sendNotification('doPlay');
            },
            pause: api => {
                api.sendNotification('doPause');
            },
            unload: api => {
                api.sendNotification('cleanMedia');
                Runner.schedule('afterRender', null, () => {
                    this.element.innerHTML = '';
                });
            },
            seek: (api, time) => {
                api.sendNotification('doSeek', time);
            },
            volume: (api, volume) => {
                api.sendNotification('changeVolume', volume);
            }
        };

        this.__api__.events = {
            playerPlayEnd: () => {
                this.__setProperty__('ended', true);
                this.__setProperty__('paused', true);
            },
            durationChange: params => {
                this.__setProperty__('duration', params.newValue);
            },
            playerPaused: () => {
                this.__setProperty__('paused', true);
            },
            playerPlayed: () => {
                this.__setProperty__('paused', false);
                this.__setProperty__('ended', false);
            },
            playerSeekStart: () => {
                this.__setProperty__('seeking', true);
            },
            playerSeekEnd: () => {
                this.__setProperty__('seeking', false);
            },
            playerUpdatePlayhead: time => {
                this.__setProperty__('currentTime', time);
            },
            openFullScreen: () => {
                this.__setProperty__('minimized', false);
            },
            closeFullScreen: () => {
                this.__setProperty__('minimized', true);
            },
            volumeChanged: params => {
                this.__setProperty__('volume', params.newVolume);
            },
            mute: () => {
                this.__setProperty__('muted', true);
            },
            unmute: () => {
                this.__setProperty__('muted', false);
            },
            mediaError: errorEvent => {
                this.__setProperty__('error', errorEvent);
            }
        };

        this.__api__.onReady = api => {
            this.__setProperty__('duration', api.evaluate('{duration}'));
        };
    }
}
