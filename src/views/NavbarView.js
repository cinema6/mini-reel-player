import View from '../../lib/core/View.js';
import Hideable from '../mixins/Hideable.js';

class NavbarView extends View {}
NavbarView.mixin(Hideable);

export default NavbarView;
