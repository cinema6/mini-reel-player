import View from '../../lib/core/View.js';
import Touchable from '../mixins/Touchable.js';

export default class CheckboxView extends View {
    constructor() {
        super(...arguments);

        this.tag = 'input';
        this.attributes.type = 'checkbox';
    }

    get checked() {
        return (this.element && this.element.checked) || false;
    }
    set checked(value) {
        if (!this.element) { this.create(); }
        this.element.checked = value;
    }

    click(event) {
        this.sendAction(this, this.checked);

        event.preventDefault();
    }
}
CheckboxView.mixin(Touchable);
