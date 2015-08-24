import CardView from '../CardView.js';

export default class LightTwitterGifCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightTwitterGifCardView.html');
    }
}
