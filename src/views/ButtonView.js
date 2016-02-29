import View from '../../lib/core/View.js';
import Touchable from '../../src/mixins/Touchable.js';
import ContextualView from '../../src/mixins/ContextualView.js';

class ButtonView extends View {
    constructor() {
        super(...arguments);

        this.tag = 'button';
    }

    enable() {
        this.setAttribute('disabled', false);
    }

    disable() {
        this.setAttribute('disabled', true);
    }

    click() {
        if (this.element.getAttribute('disabled') !== null) { return; }

        this.emit('press');
        this.sendAction(this);
    }
}
ButtonView.mixin(Touchable, ContextualView);
export default ButtonView;
