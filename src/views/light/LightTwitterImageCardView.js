import CardView from '../CardView.js';

export default class LightTwitterImageCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightTwitterImageCardView.html');
    }
}
