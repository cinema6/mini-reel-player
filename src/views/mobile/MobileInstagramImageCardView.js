import CardView from '../CardView.js';
import ListView from '../ListView.js';

export default class MobileInstagramImageCardView extends CardView {
    constructor() {
        super(...arguments);

        this.instantiates = {
            ListView
        };

        this.template = require('./MobileInstagramImageCardView.html');
    }
}
