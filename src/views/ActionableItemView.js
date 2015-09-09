import TemplateView from '../../lib/core/TemplateView.js';
import {createKey} from 'private-parts';

const _ = createKey();

export default class ActionableItemView extends TemplateView {
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
