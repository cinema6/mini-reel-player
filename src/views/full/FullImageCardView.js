import CardView from '../CardView.js';
import TemplateView from '../../../lib/core/TemplateView.js';

export default class FullImageCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullImageCardView.html');
        this.instantiates = { TemplateView: TemplateView };

    }
}
