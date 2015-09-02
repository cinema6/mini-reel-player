import CardView from './CardView.js';
import ActionableItemView from './ActionableItemView.js';
import {
    extend
} from '../../lib/utils.js';

export default class VideoCardView extends CardView {
    constructor() {
        super(...arguments);

        this.moduleOutlets = {};
    }

    update(data) {
        if(data.links) {
            super(extend(data, {
                isSponsored: !!(data.logo || data.links.length > 0 || data.sponsor),
                hasSponsoredCopy: !!(data.links.length > 0 || data.sponsor),
                hasLinks: !!(data.links.length > 0 || data.website)
            }));
            this.links.update(data.links);
        } else {
            super(data);
        }
        if(this.shareLinks && data.shareLinks) {
            this.shareLinks.itemIdentifier = 'type';
            this.shareLinks.itemViewClass = ActionableItemView;
            this.shareLinks.update(data.shareLinks);
        }
    }

    didCreateElement() {
        super(...arguments);

        this.moduleOutlets = {
            displayAd: this.displayAdOutlet,
            post: this.postOutlet
        };
    }
}
