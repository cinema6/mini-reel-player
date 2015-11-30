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
    return new Error(`EmbeddedPlayer cannot ${method}.`);
}

function forEachNode(node, iterator) {
    iterator(node);
    forEach(node.childNodes, child => forEachNode(child, iterator));
}

const _ = createKey();

export default class EmbeddedPlayer extends CorePlayer {
    constructor() {
        super(...arguments);

        this.src = null;
        this.currentTime = 0;

        _(this).readyState = 0;

        _(this).src = null;
        _(this).workspace = document.createElement('div');
        _(this).embedChildren = [];
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
        return noMethodError('play');
    }

    pause() {
        return noMethodError('pause');
    }

    minimize() {
        return noMethodError('minimize');
    }

    load() {
        if (this.src === _(this).src) { return; }

        this.unload();

        _(this).src = this.src;

        const { workspace } = _(this);
        const element = this.element || this.create();

        workspace.innerHTML = this.src;
        // If a script is inserted as part of an innerHTML it never downloads or executes its
        // playload. To make that happen, we look for scripts in the DOM and replace them with ones
        // created by calls to document.createElement().
        forEachNode(workspace, node => {
            if (node.tagName !== 'SCRIPT') { return; }

            const script = document.createElement('script');
            forEach(node.attributes, attribute => {
                script.setAttribute(attribute.name, attribute.value);
            });

            node.parentNode.replaceChild(script, node);
        });

        const children = _(this).embedChildren = arrayFrom(workspace.childNodes);

        Runner.schedule('afterRender', null, () => {
            forEach(children, child => element.appendChild(child));
            Runner.runNext(() => {
                _(this).readyState = 3;
                this.emit('canplay');
            });
        });
    }

    unload() {
        const { element } = this;
        if (!element) { return super.unload(); }

        _(this).src = null;
        _(this).readyState = 0;

        const children = _(this).embedChildren.slice();

        Runner.schedule('afterRender', null, () => {
            forEach(children, child => element.removeChild(child));
        });

        _(this).embedChildren.length = 0;

        return super.unload();
    }

    reload() {
        this.unload();
        this.load();
    }
}
