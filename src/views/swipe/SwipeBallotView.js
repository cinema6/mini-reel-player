import TemplateView from '../../../lib/core/TemplateView.js';
import ButtonView from '../ButtonView.js';

const SHOW_CLASS = 'card__question--show';

export default class SwipeBallotView extends TemplateView {
    constructor() {
        super(...arguments);

        this.tag = 'div';
        this.classes.push('card__question');
        this.template = require('./SwipeBallotView.html');
        this.instantiates = {ButtonView};
    }

    show() {
        this.addClass(SHOW_CLASS);
    }

    hide() {
        this.removeClass(SHOW_CLASS);
    }
}
