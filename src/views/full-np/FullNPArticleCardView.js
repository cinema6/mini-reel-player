import CardView from '../CardView.js';

export default class FullNPArticleCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullNPArticleCardView.html');
    }
}
