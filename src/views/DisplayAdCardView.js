import CardView from './CardView.js';
import View from '../../lib/core/View.js';
import LinksListView from './LinksListView.js';

export default class DisplayAdCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./DisplayAdCardView.html');
        this.instantiates = {View, LinksListView};
    }

    update(data) {
        super.update(data);
        if (data.links) { this.links.update(data.links); }
    }
}
