import Card from './Card.js';
import {
    map,
    filter
} from '../../lib/utils.js';

const SOCIAL_LINKS = ['Facebook', 'Pinterest', 'Twitter', 'YouTube', 'Vimeo'];

export default class VideoCard extends Card {
    constructor(data, { data: { autoplay = true, autoadvance = true } }) { // jshint ignore:line
        super(...arguments);

        this.type = 'video';

        this.campaign = data.campaign;
        this.sponsor = data.params.sponsor;
        this.action = data.params.action || {};
        this.logo = data.collateral.logo;
        this.links = data.links || {};
        this.socialLinks = map(
            filter(
                Object.keys(this.links),
                label => SOCIAL_LINKS.indexOf(label) > -1
            ),
            label => ({ type: label.toLowerCase(), label, href: data.links[label] })
        );
        this.ad = !!data.params.ad;

        this.data = {
            type: data.type,
            source: data.source,
            hideSource: !!data.data.hideSource,
            videoid: data.data.videoid,
            href: data.data.href,
            controls: data.data.controls,
            autoplay: 'autoplay' in data.data ? data.data.autoplay : autoplay,
            autoadvance: 'autoadvance' in data.data ? data.data.autoadvance : autoadvance
        };
    }

    complete() {
        super(...arguments);

        if (this.data.autoadvance) {
            this.emit('canAdvance');
        }
    }
}
