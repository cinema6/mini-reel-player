import CardView from '../CardView.js';

export default class LightPinterestImageCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightPinterestImageCardView.html');
    }
}
