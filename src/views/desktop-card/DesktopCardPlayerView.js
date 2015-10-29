import TemplateView from '../../../lib/core/TemplateView.js';
import View from '../../../lib/core/View.js';
import ButtonView from '../ButtonView.js';
import SkipTimerView from '../SkipTimerView.js';

export default class DesktopCardPlayerView extends TemplateView {
    constructor(element) {
        super(element);

        this.tag = 'div';
        this.template = require('./DesktopCardPlayerView.html');
        this.instantiates = {View, ButtonView, SkipTimerView};
    }
}
