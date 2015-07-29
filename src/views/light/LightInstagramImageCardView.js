import CardView from '../CardView.js';

export default class LightInstagramImageCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightInstagramImageCardView.html');
    }
}
