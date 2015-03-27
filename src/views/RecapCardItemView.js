import TemplateView from '../../lib/core/TemplateView.js';

export default class RecapCardItemView extends TemplateView {
    constructor() {
        super(...arguments);

        this.tag = 'li';
    }

    click() {
        this.emit('select');
    }
}
