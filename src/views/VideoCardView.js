import CardView from './CardView.js';
import View from '../../lib/core/View.js';
import LinksListView from './LinksListView.js';
import {
    extend,
    filter
} from '../../lib/utils.js';

const SOCIAL_LINKS = ['facebook', 'pinterest', 'twitter', 'youtube', 'vimeo'];

export default class VideoCardView extends CardView {
    constructor() {
        super(...arguments);

        this.instantiates = {View, LinksListView};
        this.template = require('./VideoCardView.html');
    }

    update(data) {
        if (!data.links) { return super(data); }

        const links = filter(data.links, link => SOCIAL_LINKS.indexOf(link.type) > -1);

        super(extend(data, {
            links,
            isSponsored: !!(data.logo || data.links.length > 0 || data.sponsor),
            hasSponsoredCopy: !!(data.links.length > 0 || data.sponsor)
        }));
        this.links.update(links);
    }
}
