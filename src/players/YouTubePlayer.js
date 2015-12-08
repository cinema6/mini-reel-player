import ThirdPartyPlayer from './ThirdPartyPlayer.js';
import { stringify } from 'querystring';
import codeLoader from '../../src/services/code_loader.js';
import Runner from '../../lib/Runner.js';
import {
    defer
} from '../../lib/utils.js';

{
    const deferred = defer(Promise);

    codeLoader.configure('youtube', {
        src: 'https://www.youtube.com/iframe_api',

        before() {
            global.onYouTubeIframeAPIReady = () => {
                delete global.onYouTubeIframeAPIReady;
                deferred.fulfill(global.YT);
            };
        },

        after() {
            return deferred.promise;
        }
    });
}

export default class YouTubePlayer extends ThirdPartyPlayer {
    constructor() {
        super(...arguments);

        this.__api__.name = 'YouTubePlayer';

        this.__api__.loadPlayer = src => {
            const iframe = document.createElement('iframe');
            const params = {
                html5: 1,
                wmode: 'opaque',
                rel: 0,
                enablejsapi: 1,
                playsinline: 1,
                controls: Number(this.controls)
            };

            iframe.src = `https://www.youtube-nocookie.com/embed/${src}?${stringify(params)}`;

            Runner.schedule('afterRender', this.element, 'appendChild', [iframe]);

            return codeLoader.load('youtube').then(YT => new Promise(resolve => {
                const player = new YT.Player(iframe, {
                    events: {
                        onReady: () => resolve(player),
                        onStateChange: ({ data }) => {
                            switch (data) {
                            case YT.PlayerState.PLAYING:
                                this.__setProperty__('paused', false);
                                this.__setProperty__('ended', false);
                                break;
                            case YT.PlayerState.PAUSED:
                                this.__setProperty__('paused', true);
                                break;
                            case YT.PlayerState.ENDED:
                                this.__setProperty__('ended', true);
                                this.__setProperty__('paused', true);
                                break;
                            }
                        }
                    }
                });
            }));
        };

        this.__api__.onReady = (api => this.__setProperty__('duration', api.getDuration()));

        this.__api__.pollingDelay = 250;
        this.__api__.onPoll = (api => {
            this.__setProperty__('currentTime', api.getCurrentTime());
            this.__setProperty__('duration', api.getDuration());
            this.__setProperty__('volume', api.getVolume() / 100);
        });

        this.__api__.methods.unload = (() => {
            Runner.schedule('afterRender', this.element, 'removeChild', [this.element.firstChild]);
        });
        this.__api__.methods.seek = ((api, time) => api.seekTo(time));
        this.__api__.methods.volume = ((api, volume) => api.setVolume(volume * 100));
        this.__api__.methods.pause = (api => api.pauseVideo());
        this.__api__.methods.play = (api => api.playVideo());
    }
}
