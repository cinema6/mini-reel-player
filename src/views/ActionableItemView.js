import TemplateView from '../../lib/core/TemplateView.js';

export default class ActionableItemView extends TemplateView {
    constructor() {
        super(...arguments);
        this.item = null;
    }

    update(data) {
        super(data);
        this.item = data;
    }

    click() {
        this.sendAction(this, this.item);
    }
}
