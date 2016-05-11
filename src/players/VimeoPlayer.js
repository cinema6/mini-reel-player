import Runner from '../../lib/Runner.js';
import RunnerPromise from '../../lib/RunnerPromise.js';
import ThirdPartyPlayer from './ThirdPartyPlayer.js';
import {noop} from '../../lib/utils.js';
import urlParser from '../services/url_parser.js';
import vimeo from '../services/vimeo.js';

const API_POLL_INTERVAL = 250;
const HAVE_ENOUGH_DATA = 4;

export default class VimeoPlayer extends ThirdPartyPlayer {
    constructor() {
        super(...arguments);

        this.__api__.name = 'VimeoPlayer';
        this.__api__.loadPlayer = src => {
            const iframe = document.createElement('iframe');
            const attr = ((attribute, value = '') => iframe.setAttribute(attribute, value));

            attr(
                'src',
                urlParser.parse(`//player.vimeo.com/video/${src}?api=1&player_id=${this.id}`).href
            );
            attr('width', '100%');
            attr('height', '100%');
            attr('frameborder', '0');
            attr('webkitAllowFullScreen');
            attr('mozallowfullscreen');
            attr('allowFullScreen');

            Runner.schedule('afterRender', this.element, 'appendChild', [iframe]);

            const player = new vimeo.Player(iframe);
            return new RunnerPromise(function(resolve) {
                player.once('ready', () => resolve(player));
            });
        };

        this.__api__.methods = {
            pause: api => {
                return api.call('pause');
            },
            seek: (api, time) => {
                return api.call('seekTo', time);
            },
            play: api => {
                return api.call('play');
            },
            unload: () => {
                Runner.schedule('afterRender', null, () => this.element.innerHTML = '');
            },
            volume: (api, volume) => {
                return api.call('setVolume', volume);
            },
            addEventListener: (api, name, handler) => {
                api.on(name, (...args) => process.nextTick(() =>
                    Runner.run(() => handler(...args))));
            },
            removeEventListener: noop
        };

        this.__api__.events = {
            loadProgress: ({ percent }) => {
                const percentLoaded = parseFloat(percent);

                if (percentLoaded >= 0.25) {
                    this.__setProperty__('readyState', HAVE_ENOUGH_DATA);
                }
            },
            finish: () => {
                this.__setProperty__('ended', true);
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
            playProgress: ({ seconds }) => {
                const time = parseFloat(seconds);
                this.__setProperty__('currentTime', time);
            }
        };

        this.__api__.onReady = api => {
            return api.call('getDuration').then(duration => {
                this.__setProperty__('duration', duration);
            });
        };

        this.__api__.pollingDelay = API_POLL_INTERVAL;
        this.__api__.onPoll = api => {
            return api.call('getVolume').then(volume => {
                this.__setProperty__('volume', volume);
                this.__setProperty__('muted', (volume === 0));
            });
        };
    }
}
