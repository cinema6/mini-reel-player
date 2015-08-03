import CardView from '../CardView.js';

export default class FullInstagramVideoCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullInstagramVideoCardView.html');
    }
}
