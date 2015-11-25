import CardView from '../CardView.js';

export default class LightArticleCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightArticleCardView.html');
    }
}
