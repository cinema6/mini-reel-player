import TemplateView from '../../lib/core/TemplateView.js';

const HIDE_CLASS = 'ui--offscreen';

export default class CardView extends TemplateView {
    constructor() {
        super(...arguments);

        this.tag = 'li';
    }

    show() {
        this.removeClass(HIDE_CLASS);
    }

    hide() {
        this.addClass(HIDE_CLASS);
    }
}
