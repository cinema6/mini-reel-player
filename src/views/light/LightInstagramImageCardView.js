import CardView from '../CardView.js';
import ListView from '../ListView.js';

export default class LightInstagramImageCardView extends CardView {
    constructor() {
        super(...arguments);

        this.instantiates = {
            ListView
        };

        this.template = require('./LightInstagramImageCardView.html');
    }
}
