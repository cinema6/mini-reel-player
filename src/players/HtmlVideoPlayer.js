import Runner from '../../lib/Runner.js';
import RunnerPromise from '../../lib/RunnerPromise.js';
import ThirdPartyPlayer from './ThirdPartyPlayer.js';

const HAVE_METADATA = 1;

let exitFullscreen = function(video) {
    const documentExitFullscreen = document.exitFullscreen ||
        document.msExitFullscreen ||
        document.mozCancelFullScreen ||
        document.webkitExitFullscreen;

    const videoExitFullscreen = video.exitFullscreen ||
        video.msExitFullscreen ||
        video.mozCancelFullScreen ||
        video.webkitExitFullscreen;

    if (documentExitFullscreen) {
        exitFullscreen = function() {
            documentExitFullscreen.call(document);
        };
    } else {
        exitFullscreen = function(video) {
            videoExitFullscreen.call(video);
        };
    }

    exitFullscreen(video);
};

export default class HtmlVideoPlayer extends ThirdPartyPlayer {
    constructor() {
        super(...arguments);
        
        this.__api__.name = 'HtmlVideoPlayer';

        this.__api__.autoplayTest = false;
        
        this.__api__.loadPlayer = src => {
            const video = document.createElement('video');
            video.setAttribute('src', src);
            return new RunnerPromise(resolve => {
                Runner.schedule('afterRender', null, () => {
                    const loadstartFn = () => process.nextTick(() => Runner.run(() => {
                        video.removeEventListener('loadstart', loadstartFn, false);
                        video.controls = true;
                        resolve(video);
                    }));
                    video.addEventListener('loadstart', loadstartFn, false);
                    this.element.appendChild(video);
                });
            });
        };
        
        this.__api__.methods = {
            seek: (api, time) => {
                api.currentTime = time;
            },
            play: api => {
                api.play();
            },
            pause: api => {
                api.pause();
            },
            minimize: api => {
                exitFullscreen(api);
            },
            unload: api => {
                Runner.schedule('afterRender', this.element, 'removeChild', [api]);
            },
            controls: (api, showControls) => {
                api.controls = showControls;
            },
            addEventListener: (api, name, handler) => {
                const handlerFn = () => process.nextTick(() => Runner.run(() => {
                    handler(api);
                }));
                api.addEventListener(name, handlerFn, false);
                return handlerFn;
            },
            removeEventListener: (api, name, handler) => {
                api.removeEventListener(name, handler, false);
            }
        };
        
        this.__api__.events = {
            loadedmetadata: api => {
                this.__setProperty__('duration', api.duration);
                this.__setProperty__('readyState', HAVE_METADATA);
            },
            play: api => {
                this.__setProperty__('paused', api.paused);
            },
            pause: api => {
                this.__setProperty__('paused', api.paused);
            },
            error: api => {
                this.__setProperty__('error', api.error);
            },
            ended: api => {
                this.__setProperty__('ended', api.ended);
            },
            timeupdate: api => {
                this.__setProperty__('currentTime', api.currentTime);
            },
            volumechange: api => {
                this.__setProperty__('muted', api.muted);
                this.__setProperty__('volume', api.volume);
            },
            seeking: api => {
                this.__setProperty__('seeking', api.seeking);
            },
            seeked: api => {
                this.__setProperty__('seeking', api.seeking);
            }
        };
    }
}
