import CardView from '../CardView.js';

export default class FullPinterestImageCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullPinterestImageCardView.html');
    }
}
