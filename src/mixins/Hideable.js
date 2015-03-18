import Runner from '../../lib/Runner.js';
import animator from '../../lib/animator.js';
import {createKey} from 'private-parts';

const _ = createKey();

function Hideable() {
    _(this).display = '';
    _(this).shown = true;
}
Hideable.prototype = {
    hide() {
        const element = this.element || this.create();

        if (!_(this).shown) { return; }

        _(this).shown = false;
        _(this).display = element.style.display;

        Runner.schedule('render', () => {
            return animator.trigger('view:hide', this)
                .then(() => element.style.display = 'none');
        });
    },

    show() {
        const element = this.element || this.create();

        _(this).shown = true;

        Runner.schedule('render', () => {
            return animator.trigger('view:show', this)
                .then(() => element.style.display = _(this).display);
        });
    }
};

export default Hideable;
