import CardView from '../CardView.js';

export default class LightTwitterTextCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightTwitterTextCardView.html');
    }
}
