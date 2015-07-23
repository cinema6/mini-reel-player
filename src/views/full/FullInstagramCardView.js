import CardView from '../CardView.js';
import ListView from '../ListView.js';

export default class FullInstagramCardView extends CardView {
    constructor() {
        super(...arguments);

        this.instantiates = {
            ListView
        };

        this.template = require('./FullInstagramCardView.html');
    }
}
