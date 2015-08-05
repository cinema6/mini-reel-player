import CardView from '../CardView.js';

export default class LightFacebookArticleCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightFacebookArticleCardView.html');
    }
}
