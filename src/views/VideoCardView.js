import CardView from './CardView.js';
import {
    extend
} from '../../lib/utils.js';

const VIDEO_ONLY_CLASS = 'cards__item--FullVideoOnlyMR';

export default class VideoCardView extends CardView {
    constructor() {
        super(...arguments);

        this.moduleOutlets = {};
    }

    update(data) {
        if (!data.links || !('videoOnly' in data)) { return super(data); }

        super(extend(data, {
            isSponsored: !!(data.website.logo || data.links.length > 0 || data.sponsor),
            hasSponsoredCopy: !!(data.links.length > 0 || data.sponsor),
            hasLinks: !!(data.links.length > 0 || data.website.href)
        }));

        if (data.videoOnly) {
            this.addClass(VIDEO_ONLY_CLASS);
        } else {
            this.removeClass(VIDEO_ONLY_CLASS);
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
