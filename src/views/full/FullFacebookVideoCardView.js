import CardView from '../CardView.js';

export default class FullFacebookVideoCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullFacebookVideoCardView.html');
    }
}
