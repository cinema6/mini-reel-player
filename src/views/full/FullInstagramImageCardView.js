import CardView from '../CardView.js';
import ListView from '../ListView.js';

export default class FullInstagramImageCardView extends CardView {
    constructor() {
        super(...arguments);

        this.instantiates = {
            ListView
        };

        this.template = require('./FullInstagramImageCardView.html');
    }
}
