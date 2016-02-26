import TemplateView from '../../../lib/core/TemplateView.js';
import View from '../../../lib/core/View.js';
import ButtonView from '../ButtonView.js';
import SkipTimerView from '../SkipTimerView.js';

export default class MobileCardPlayerView extends TemplateView {
    constructor() {
        super(...arguments);

        this.tag = 'div';

        this.template = require('./MobileCardPlayerView.html');
        this.instantiates = { ButtonView, SkipTimerView, View };
    }
}
