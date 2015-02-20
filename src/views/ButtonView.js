import View from '../../lib/core/View.js';

export default class ButtonView extends View {
    constructor() {
        super(...arguments);

        this.tag = 'button';
    }

    enable() {
        this.setAttribute('disabled', false);
    }

    disable() {
        this.setAttribute('disabled', true);
    }

    click() {
        if (this.attributes.disabled) { return; }

        this.emit('press');
    }

    touchStart(event) {
        event.preventDefault();
    }

    touchEnd(event) {
        event.preventDefault();
        this.click();
    }
}
