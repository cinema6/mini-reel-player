import View from '../../../lib/core/View.js';
import Hideable from '../../mixins/Hideable.js';

class NavbarView extends View {
    constructor() {
        super(...arguments);

        this.id = 'navbar';
    }
}
NavbarView.mixin(Hideable);

export default NavbarView;
