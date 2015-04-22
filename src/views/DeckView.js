import View from '../../lib/core/View.js';

const HIDE_CLASS = 'ui--offscreen';

export default class DeckView extends View {
    constructor() {
        super(...arguments);
        this.hide();
    }

    show() {
        return this.removeClass(HIDE_CLASS);
    }

    hide() {
        return this.addClass(HIDE_CLASS);
    }
}
