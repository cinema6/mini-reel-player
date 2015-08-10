import CardView from '../CardView.js';

export default class LightPinterestVideoCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightPinterestVideoCardView.html');
    }
}
