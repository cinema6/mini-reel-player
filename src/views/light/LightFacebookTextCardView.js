import CardView from '../CardView.js';

export default class LightFacebookTextCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightFacebookTextCardView.html');
    }
}
