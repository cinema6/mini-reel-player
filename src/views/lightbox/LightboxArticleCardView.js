import CardView from '../CardView.js';

export default class LightboxArticleCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightboxArticleCardView.html');
    }
}