import CardView from '../CardView.js';

export default class FullFacebookImageCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullFacebookImageCardView.html');
    }
}
