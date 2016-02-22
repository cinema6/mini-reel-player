import TemplateView from '../../lib/core/TemplateView.js';

export default class LinkItemView extends TemplateView {
    constructor() {
        super(...arguments);

        this.context = this.attributes['data-link-context'] || null;
    }

    click() {
        return this.sendAction(this);
    }
}
