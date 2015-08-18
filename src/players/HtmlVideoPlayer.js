import CorePlayer from './CorePlayer.js';
import Runner from '../../lib/Runner.js';
import { createKey } from 'private-parts';

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

class Private {
    constructor(instance) {
        this.__public__ = instance;
        this.loadedmetadata = () => {
            Runner.run(() => {
                this.__public__.emit('loadedmetadata');
            });
        };
        this.canplay = () => {
            Runner.run(() => {
                this.__public__.emit('canplay');
            });
        };
        this.play = () => {
            Runner.run(() => {
                this.__public__.emit('play');
            });
        };
        this.pause = () => {
            Runner.run(() => {
                this.__public__.emit('pause');
            });
        };
        this.error = () => {
            Runner.run(() => {
                this.__public__.emit('error');
            });
        };
        this.ended = () => {
            Runner.run(() => {
                this.__public__.emit('ended');
            });
        };
        this.timeupdate = () => {
            Runner.run(() => {
                this.__public__.emit('timeupdate');
            });
        };
    }
}

const _ = createKey(instance => new Private(instance));

export default class HtmlVideoPlayer extends CorePlayer {
    constructor() {
        super(...arguments);

        this.src = null;
        this.loop = false;

        _(this).htmlVideo = null;

        if (global.__karma__) { this.__private__ = _(this); }
    }

    get currentTime() {
        const { htmlVideo } = _(this);
        return htmlVideo ? htmlVideo.currentTime : 0;
    }
    set currentTime(value) {
        const { htmlVideo } = _(this);
        if(htmlVideo) {
            htmlVideo.currentTime = value;
        }
    }

    get duration() {
        const { htmlVideo } = _(this);
        return htmlVideo ? htmlVideo.duration : 0;
    }

    get ended() {
        const { htmlVideo } = _(this);
        return htmlVideo ? htmlVideo.ended : false;
    }

    get paused() {
        const { htmlVideo } = _(this);
        return htmlVideo ? htmlVideo.paused : true;
    }

    get muted() {
        const { htmlVideo } = _(this);
        return htmlVideo ? htmlVideo.muted : false;
    }

    get volume() {
        const { htmlVideo } = _(this);
        return htmlVideo ? htmlVideo.volume : 0;
    }

    get readyState() {
        const { htmlVideo } = _(this);
        return htmlVideo ? htmlVideo.readyState : 0;
    }

    get seeking() {
        const { htmlVideo } = _(this);
        return htmlVideo ? htmlVideo.seeking : false;
    }

    get error() {
        const { htmlVideo } = _(this);
        return htmlVideo ? htmlVideo.error : null;
    }

    play() {
        this.load();
        _(this).htmlVideo.play();
    }

    pause() {
        _(this).htmlVideo.pause();
    }

    minimize() {
        exitFullscreen(_(this).htmlVideo);
    }

    load() {
        if(_(this).htmlVideo && this.src === _(this).htmlVideo.getAttribute('src')) {
            return;
        }
        this.unload();

        const element = this.element || this.create();

        const video = document.createElement('video');
        video.setAttribute('src', this.src);
        video.setAttribute('controls', 'true');
        if(this.loop) {
            video.setAttribute('loop', true);
        }
        video.addEventListener('loadedmetadata', _(this).loadedmetadata, false);
        video.addEventListener('canplay', _(this).canplay, false);
        video.addEventListener('play', _(this).play, false);
        video.addEventListener('pause', _(this).pause, false);
        video.addEventListener('error', _(this).error, false);
        video.addEventListener('ended', _(this).ended, false);
        video.addEventListener('timeupdate', _(this).timeupdate, false);
        _(this).htmlVideo = video;
        Runner.schedule('afterRender', null, () => {
            element.appendChild(video);
        });
    }

    unload() {
        const { element } = this;
        const video = _(this).htmlVideo;
        if (!element || !video) { return super(); }

        _(this).src = null;

        video.removeEventListener('loadedmetadata', _(this).loadedmetadata);
        video.removeEventListener('canplay', _(this).canplay);
        video.removeEventListener('play', _(this).play);
        video.removeEventListener('pause', _(this).pause);
        video.removeEventListener('error', _(this).error);
        video.removeEventListener('ended', _(this).ended);
        video.removeEventListener('timeupdate', _(this).timeupdate);
        Runner.schedule('afterRender', null, () => {
            element.removeChild(_(this).htmlVideo);
            _(this).htmlVideo = null;
        });

        return super();
    }

    reload() {
        this.unload();
        this.load();
    }

}
