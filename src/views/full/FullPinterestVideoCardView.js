import CardView from '../CardView.js';

export default class FullPinterestVideoCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullPinterestVideoCardView.html');
    }
}
