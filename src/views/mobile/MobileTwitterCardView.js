import CardView from '../CardView.js';

export default class MobileTwitterImageCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./MobileTwitterCardView.html');
    }
}
