import View from '../../lib/core/View.js';

export default class AnchorView extends View {
    constructor() {
        super(...arguments);

        this.tag = 'a';
    }

    enable() {
        this.setAttribute('disabled', false);
    }

    disable() {
        this.setAttribute('disabled', true);
    }

    click() {
        if (this.element.getAttribute('disabled') !== null) { return; }

        this.emit('press');
        this.sendAction(this);
    }

    touchStart(event) {
        event.preventDefault();
    }

    touchEnd(event) {
        event.preventDefault();
        this.click();
    }
}