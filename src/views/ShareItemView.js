import TemplateView from '../../lib/core/TemplateView.js';
import { createKey } from 'private-parts';

const _ = createKey();

export default class ShareItemView extends TemplateView {
    constructor() {
        super(...arguments);
        _(this).shareLink = null;
    }

    update(data) {
        super(data);
        _(this).shareLink = data;
        this.addClass('socialBtn__bg--' + data.type);
        this.addClass('socialIconsBe__light--' + data.type);
    }

    click() {
        this.sendAction(this, _(this).shareLink);
    }
}
