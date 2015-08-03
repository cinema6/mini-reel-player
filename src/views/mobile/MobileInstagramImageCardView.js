import CardView from '../CardView.js';

export default class MobileInstagramImageCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./MobileInstagramImageCardView.html');
    }
}
