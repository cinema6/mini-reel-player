import CardView from '../CardView.js';
import View from '../../../lib/core/View.js';

export default class MobileTwitterTextCardView extends CardView {
    constructor() {
        super(...arguments);

        this.instantiates = { View };
        this.template = require('./MobileTwitterTextCardView.html');
    }
}
