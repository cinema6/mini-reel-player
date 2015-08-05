import CorePlayer from './CorePlayer.js';
import Runner from '../../lib/Runner.js';
import View from '../../lib/core/View.js';
import { createKey } from 'private-parts';
import {
    forEach
} from '../../lib/utils.js';

function noMethodError(method) {
    return new Error(`VinePlayer cannot ${method}.`);
}

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
        this.currentTime = 0;

        _(this).readyState = 0;
        _(this).htmlVideo = null;

        if (global.__karma__) { this.__private__ = _(this); }
    }

    get duration() {
        return 0;
    }

    get ended() {
        return false;
    }

    get paused() {
        return true;
    }

    get muted() {
        return false;
    }

    get volume() {
        return 1;
    }

    get readyState() {
        return _(this).readyState;
    }

    get seeking() {
        return false;
    }

    get error() {
        return null;
    }

    play() {
        _(this).htmlVideo.play();
    }

    pause() {
        _(this).htmlVideo.pause();
    }

    minimize() {
        return noMethodError('minimize');
    }

    load() {
        this.unload();

        const element = this.element || this.create();

        const video = document.createElement('video');
        video.setAttribute('src', this.src);
        video.setAttribute('controls', 'true');
        if(this.loop) {
            video.setAttribute('loop', true);
        }
        _(this).htmlVideo = video;

        Runner.schedule('afterRender', null, () => {
            element.appendChild(video);
            Runner.runNext(() => {
                _(this).readyState = 3;
                this.emit('canplay');
            });
        });
    }

    unload() {
        const { element } = this;
        if (!element || !_(this).htmlVideo) { return super(); }

        _(this).src = null;
        _(this).readyState = 0;

        element.removeChild(_(this).htmlVideo);
        _(this).htmlVideo = null;

        return super();
    }

    reload() {
        this.unload();
        this.load();
    }

}
