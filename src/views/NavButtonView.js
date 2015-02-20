import ButtonView from './ButtonView.js';
import Hideable from '../mixins/Hideable.js';
import NavButtonPreviewView from './NavButtonPreviewView.js';

class NavButtonView extends ButtonView {
    constructor() {
        super(...arguments);

        this.preview = null;
    }

    setThumb(url) {
        if (!this.preview) { this.create(); }

        this.preview.setThumb(url);
    }

    didCreateElement() {
        this.preview = new NavButtonPreviewView();
        this.append(this.preview);

        return super(...arguments);
    }
}
NavButtonView.mixin(Hideable);

export default NavButtonView;
