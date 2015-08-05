import CardView from '../CardView.js';

export default class FullFacebookTextCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullFacebookTextCardView.html');
    }
}
