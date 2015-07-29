import CardView from '../CardView.js';
import ListView from '../ListView.js';

export default class MobileInstagramVideoCardView extends CardView {
    constructor() {
        super(...arguments);

        this.instantiates = {
            ListView
        };

        this.template = require('./MobileInstagramVideoCardView.html');
    }
}
