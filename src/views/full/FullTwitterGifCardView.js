import CardView from '../CardView.js';

export default class FullTwitterGifCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullTwitterGifCardView.html');
    }
}
