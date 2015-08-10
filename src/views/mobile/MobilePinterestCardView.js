import CardView from '../CardView.js';

export default class MobilePinterestCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./MobilePinterestCardView.html');
    }

}
