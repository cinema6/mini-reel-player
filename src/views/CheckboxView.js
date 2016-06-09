import View from '../../lib/core/View.js';
import Touchable from '../mixins/Touchable.js';
import Runner from '../../lib/Runner.js';

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
        // Send action in a setTimeout(). Otherwise checking the box in that action will result in
        // the box not being checked.
        setTimeout(() => Runner.run(() => this.sendAction(this, !this.checked)));

        event.preventDefault();
    }
}
CheckboxView.mixin(Touchable);
