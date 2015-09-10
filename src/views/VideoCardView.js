import CardView from './CardView.js';
import {
    extend
} from '../../lib/utils.js';

export default class VideoCardView extends CardView {
    constructor() {
        super(...arguments);

        this.moduleOutlets = {};
    }

    update(data) {
        if (!data.links) { return super(data); }

        super(extend(data, {
            isSponsored: !!(data.logo || data.links.length > 0 || data.sponsor),
            hasSponsoredCopy: !!(data.links.length > 0 || data.sponsor),
            hasLinks: !!(data.links.length > 0 || data.website)
        }));
    }

    didCreateElement() {
        super(...arguments);

        this.moduleOutlets = {
            displayAd: this.displayAdOutlet,
            post: this.postOutlet
        };
    }
}
