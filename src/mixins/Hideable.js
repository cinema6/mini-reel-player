import Runner from '../../lib/Runner.js';
import animator from '../../lib/animator.js';
import {createKey} from 'private-parts';

const _ = createKey();

function show(shown) {
    const { element } = this;

    if (shown) {
        return animator.trigger('view:show', this)
            .then(() => element.style.display = _(this).display);
    } else {
        return animator.trigger('view:hide', this)
            .then(() => element.style.display = 'none');
    }
}

function Hideable() {
    _(this).display = '';
    _(this).shown = true;
}
Hideable.prototype = {
    hide() {
        if (!_(this).shown) { return; }
        const element = this.element || this.create();

        _(this).shown = false;
        _(this).display = element.style.display;

        Runner.scheduleOnce('render', this, show, [false]);
    },

    show() {
        if (_(this).shown) { return; }
        _(this).shown = true;

        Runner.scheduleOnce('render', this, show, [true]);
    }
};

export default Hideable;
