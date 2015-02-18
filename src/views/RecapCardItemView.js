import TemplateView from '../../lib/core/TemplateView.js';
import {
    noop
} from '../../lib/utils.js';

export default class RecapCardItemView extends TemplateView {
    constructor() {
        super(...arguments);

        this.tag = 'li';
        this.template = require('./RecapCardItemView.html');
        this.classes.push('recap__item', 'card__group', 'clearfix');
    }

    didCreateElement() {
        this.element.onclick = noop;
        return super(...arguments);
    }

    click() {
        this.emit('select');
    }
}
