import TemplateView from '../../lib/core/TemplateView.js';

export default class LinkItemView extends TemplateView {
    constructor() {
        super(...arguments);

        this.type = null;
    }

    update(data) {
        if (data) {
            this.type = data.label;
        }

        return super.update(data);
    }

    click() {
        return this.sendAction(this);
    }
}
