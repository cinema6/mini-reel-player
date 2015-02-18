import Runner from '../../lib/Runner.js';
import {createKey} from 'private-parts';

const _ = createKey();

function Hideable() {
    _(this).display = '';
}
Hideable.prototype = {
    hide() {
        const element = this.element || this.create();

        _(this).display = element.style.display;

        Runner.schedule('render', () => element.style.display = 'none');
    },

    show() {
        const element = this.element || this.create();

        Runner.schedule('render', () => element.style.display = _(this).display);
    }
};

export default Hideable;
