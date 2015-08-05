import CardView from '../CardView.js';

export default class FullFacebookArticleCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullFacebookArticleCardView.html');
    }
}
