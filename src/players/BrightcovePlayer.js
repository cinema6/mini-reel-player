import Runner from '../../lib/Runner.js';
import ThirdPartyPlayer from './ThirdPartyPlayer.js';
import RunnerPromise from '../../lib/RunnerPromise.js';

export default class BrightcovePlayer extends ThirdPartyPlayer {
    constructor() {
        super(...arguments);
        
        this.__api__.name = 'BrightcovePlayer';
        this.__api__.loadPlayer = src => {
            var ids = JSON.parse(src);
            var iframe = document.createElement('iframe');
            iframe.setAttribute('src', 'blank.html');

            var video = document.createElement('video');
            video.setAttribute('id', ids.videoid);
            video.setAttribute('data-video-id', ids.videoid);
            video.setAttribute('data-account', ids.accountid);
            video.setAttribute('data-player', ids.playerid);
            video.setAttribute('data-embed', ids.embedid);
            video.setAttribute('class', 'video-js');
            video.setAttribute('controls', '');
            video.setAttribute('webkit-playsinline', '');
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.position = 'absolute';
            video.style.top = '0px';
            video.style.bottom = '0px';
            video.style.right = '0px';
            video.style.left = '0px';

            var script = document.createElement('script');
            script.setAttribute('src', `https://players.brightcove.net/${
                ids.accountid}/${ids.playerid}_${ids.embedid}/index.min.js`);

            iframe.addEventListener('load', () => {
                iframe.contentDocument.body.appendChild(video);
                iframe.contentDocument.body.appendChild(script);
            }, false);

            Runner.schedule('afterRender', null, () => {
                this.element.appendChild(iframe);
            });

            return new RunnerPromise(resolve => {
                script.addEventListener('load', () => {
                    const brightcove = iframe.contentWindow.videojs(ids.videoid);
                    brightcove.one('loadedmetadata', () => Runner.run(() =>
                        this.__setProperty__('duration', brightcove.duration())));
                    brightcove.ready(() => resolve(brightcove));
                }, false);
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
                api.currentTime(time);
            },
            volume: (api, volume) => {
                api.volume(volume);
            },
            minimize: api => {
                api.exitFullscreen();
            },
            addEventListener: (api, name, handler) => {
                api.on(name, () => process.nextTick(() => {
                    Runner.run(() => handler(api));
                }));
            },
            removeEventListener: (api, name) => {
                api.off(name);
            }
        };
        this.__api__.events = {
            'bc-catalog-error': api => {
                this.__setProperty__('error', api.error());
            },
            durationchange: api => {
                this.__setProperty__('duration', api.duration());
            },
            ended: api => {
                this.__setProperty__('ended', api.ended());
            },
            error: api => {
                this.__setProperty__('error', api.error());
            },
            fullscreenchange: api => {
                this.__setProperty__('minimized', !api.isFullscreen());
            },
            pause: api => {
                this.__setProperty__('paused', api.paused());
            },
            play: api => {
                this.__setProperty__('paused', api.paused());
            },
            timeupdate: api => {
                this.__setProperty__('currentTime', api.currentTime());
            },
            volumechange: api => {
                this.__setProperty__('volume', api.volume());
            },
            resize: api => {
                this.__setProperty__('width', api.width());
                this.__setProperty__('height', api.height());
            }
        };
    }
}
