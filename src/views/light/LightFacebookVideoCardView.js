import CardView from '../CardView.js';

export default class LightFacebookVideoCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightFacebookVideoCardView.html');
    }
}
