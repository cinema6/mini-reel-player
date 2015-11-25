import CardView from '../CardView.js';
import PlayerOutletView from '../PlayerOutletView.js';
import SkipButtonView from './SkipButtonView.js';
import TemplateView from '../../../lib/core/TemplateView.js';

export default class SwipePrerollCardView extends CardView {
    constructor() {
        super(...arguments);

        this.tag = 'div';
        this.classes = new TemplateView().classes.concat(['flyOver__group']);
        this.template = require('./SwipePrerollCardView.html');
        this.instantiates = {PlayerOutletView, SkipButtonView};
    }
}
