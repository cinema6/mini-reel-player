import CardView from '../CardView.js';

export default class MobileInstagramVideoCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./MobileInstagramVideoCardView.html');
    }
}
