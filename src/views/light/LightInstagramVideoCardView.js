import CardView from '../CardView.js';

export default class LightInstagramVideoCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightInstagramVideoCardView.html');
    }
}