import CardView from './CardView.js';
import View from '../../lib/core/View.js';
import LinksListView from './LinksListView.js';
import {
    extend
} from '../../lib/utils.js';

export default class VideoCardView extends CardView {
    constructor() {
        super(...arguments);

        this.instantiates = {View, LinksListView};
        this.template = require('./VideoCardView.html');
    }

    update(data) {
        if (!data.links) { return super(data); }

        super(extend(data, {
            isSponsored: !!(data.logo || data.links.length > 0 || data.sponsor),
            hasSponsoredCopy: !!(data.links.length > 0 || data.sponsor)
        }));
        this.links.update(data.links);
    }
}
