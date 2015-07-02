import CardView from '../CardView.js';

export default class MobileArticleCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./MobileArticleCardView.html');
    }

}
