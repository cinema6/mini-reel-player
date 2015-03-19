import View from '../../lib/core/View.js';

export default class PlayerOutletView extends View {
    show() {
        this.removeClass('player--fly-away');
    }

    hide() {
        this.addClass('player--fly-away');
    }
}
