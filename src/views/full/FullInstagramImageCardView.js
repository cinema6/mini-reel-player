import CardView from '../CardView.js';

export default class FullInstagramImageCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullInstagramImageCardView.html');
    }
}
