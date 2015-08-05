import CardView from '../CardView.js';

export default class LightTwitterVideoCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightTwitterVideoCardView.html');
    }
}
