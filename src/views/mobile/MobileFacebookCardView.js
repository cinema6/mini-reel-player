import CardView from '../CardView.js';

export default class MobileFacebookCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./MobileFacebookCardView.html');
    }
}
