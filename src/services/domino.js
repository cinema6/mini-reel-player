import domino from 'domino.css/runtime';
import { createKey } from 'private-parts';

const _ = createKey();

class Domino {
    constructor() {
        _(this).reapply = null;
    }

    apply() {
        if (!_(this).reapply) {
            _(this).reapply = domino.bootstrap(document.documentElement);
        } else {
            _(this).reapply();
        }
    }
}

export default new Domino();
