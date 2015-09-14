import TemplateView from '../../lib/core/TemplateView.js';
import Touchable from '../../src/mixins/Touchable.js';
import {createKey} from 'private-parts';

const _ = createKey();

class ActionableItemView extends TemplateView {
    constructor() {
        super(...arguments);
        _(this).item = null;

        if (global.__karma__) { this.__private__ = _(this); }
    }

    update(data) {
        super(data);
        _(this).item = data;
    }

    click() {
        this.sendAction(this, _(this).item);
    }
}
ActionableItemView.mixin(Touchable);
export default ActionableItemView;
