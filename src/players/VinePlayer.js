import CorePlayer from './CorePlayer.js';
import Runner from '../../lib/Runner.js';
import { createKey } from 'private-parts';
import {
    forEach
} from '../../lib/utils.js';

function arrayFrom(arrayLike) {
    let length = arrayLike.length;
    const result = [];

    while (length--) {
        result[length] = arrayLike[length];
    }

    return result;
}

function noMethodError(method) {
    return new Error(`VinePlayer cannot ${method}.`);
}

let _;

class Private {
    constructor(instance) {
        this.__public__ = instance;
    }

    loadEmbed(id, audio) {
        const vineSrc = 'https://vine.co/v/' + id + '/embed/simple' + ((audio)?'?audio=1':'');
        const embed = '<iframe src="' + vineSrc + '" ' +
                        'style="width:100%;height:100%" ' +
                        'frameborder="0">' +
                      '</iframe>';
        const scriptSrc = 'https://platform.vine.co/static/scripts/embed.js';

        this.__public__.unload();

        const { workspace } = this;
        const element = this.__public__.element || this.__public__.create();

        workspace.innerHTML = embed;
        const script = document.createElement('script');
        script.setAttribute('src', scriptSrc);
        workspace.appendChild(script);

        const children = this.embedChildren = arrayFrom(workspace.childNodes);

        Runner.schedule('afterRender', null, () => {
            forEach(children, child => element.appendChild(child));
            Runner.runNext(() => {
                this.readyState = 3;
                this.__public__.emit('canplay');
            });
        });
    }
}

_ = createKey(instance => new Private(instance));

export default class VinePlayer extends CorePlayer {
    constructor() {
        super(...arguments);

        this.src = null;
        this.currentTime = 0;

        _(this).readyState = 0;

        _(this).workspace = document.createElement('div');
        _(this).embedChildren = [];

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
        _(this).loadEmbed(this.src, true);
    }

    pause() {
        _(this).loadEmbed(this.src, false);
    }

    minimize() {
        return noMethodError('minimize');
    }

    load() {
        _(this).loadEmbed(this.src, false);
    }

    unload() {
        const { element } = this;
        if (!element) { return super(); }

        _(this).src = null;
        _(this).readyState = 0;

        const children = _(this).embedChildren.slice();

        Runner.schedule('afterRender', null, () => {
            forEach(children, child => element.removeChild(child));
        });

        _(this).embedChildren = [];

        return super();
    }

    reload() {
        this.unload();
        this.load();
    }

}
