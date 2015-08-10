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

let _;

class Private {
    constructor(instance) {
        this.__public__ = instance;
    }
}

_ = createKey(instance => new Private(instance));

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
        video.addEventListener('loadedmetadata', () => {
            this.emit('loadedmetadata');
        });
        video.addEventListener('canplay', () => {
            Runner.runNext(() => {
                element.appendChild(video);
                this.emit('canplay');
            });
        });
        video.addEventListener('play', () => {
            this.emit('play');
        });
        video.addEventListener('pause', () => {
            this.emit('pause');
        });
        video.addEventListener('error', () => {
            this.emit('error');
        });
        video.addEventListener('ended', () => {
            this.emit('ended');
        });
        video.addEventListener('timeupdate', () => {
            this.emit('timeupdate');
        });
        _(this).htmlVideo = video;
    }

    unload() {
        const { element } = this;
        const video = _(this).htmlVideo;
        if (!element || !video) { return super(); }

        _(this).src = null;

        video.removeEventListener('loadedmetadata');
        video.removeEventListener('canplay');
        video.removeEventListener('play');
        video.removeEventListener('pause');
        video.removeEventListener('error');
        video.removeEveneListener('ended');
        video.removeEveneListener('timeupdate');
        element.removeChild(_(this).htmlVideo);
        _(this).htmlVideo = null;

        return super();
    }

    reload() {
        this.unload();
        this.load();
    }

}
