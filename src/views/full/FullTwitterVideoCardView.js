import CardView from '../CardView.js';

export default class FullTwitterVideoCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullTwitterVideoCardView.html');
    }
}
