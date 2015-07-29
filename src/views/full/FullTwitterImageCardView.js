import CardView from '../CardView.js';

export default class FullTwitterImageCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullTwitterImageCardView.html');
    }
}
