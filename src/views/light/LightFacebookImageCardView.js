import CardView from '../CardView.js';

export default class LightFacebookImageCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightFacebookImageCardView.html');
    }
}
