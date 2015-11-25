import ButtonView from '../ButtonView.js';
import Runner from '../../../lib/Runner.js';

function setText(text) {
    this.template = text;

    if (this.element) {
        this.element.textContent = text;
    }
}

export default class SkipButtonView extends ButtonView {
    constructor() {
        super(...arguments);

        this.template = 'Skip';
    }

    disable() {
        if (this.attributes.disabled) { return; }

        Runner.scheduleOnce('render', this, setText, ['Skip in ...']);
        return super();
    }

    enable() {
        if (!this.attributes.disabled) { return; }

        Runner.scheduleOnce('render', this, setText, ['Skip']);
        return super();
    }

    update(time) {
        this.disable();
        Runner.scheduleOnce('render', this, setText, [`Skip in ${time}`]);
    }
}
