import CardView from '../CardView.js';

export default class FullArticleCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullArticleCardView.html');
    }
}
