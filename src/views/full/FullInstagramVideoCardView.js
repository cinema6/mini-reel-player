import CardView from '../CardView.js';
import ListView from '../ListView.js';

export default class FullInstagramVideoCardView extends CardView {
    constructor() {
        super(...arguments);

        this.instantiates = {
            ListView
        };

        this.template = require('./FullInstagramVideoCardView.html');
    }
}
