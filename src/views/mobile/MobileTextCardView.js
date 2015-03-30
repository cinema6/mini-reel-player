import CardView from '../CardView.js';

export default class MobileTextCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./MobileTextCardView.html');
    }
}
