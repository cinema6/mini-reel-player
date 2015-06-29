import CardView from '../CardView.js';
import View from '../../../lib/core/View.js';

export default class LightboxArticleCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightboxArticleCardView.html');
        this.instantiates = {
            View
        };
    }
}
