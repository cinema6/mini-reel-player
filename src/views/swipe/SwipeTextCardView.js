import CardView from '../CardView.js';

export default class SwipeTextCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./SwipeTextCardView.html');
    }
}
