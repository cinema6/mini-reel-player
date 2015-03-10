import Card from './Card.js';

export default class VideoCard extends Card {
    constructor(data, autoplay = true, autoadvance = true) {
        super(...arguments);

        this.type = 'video';

        this.sponsor = data.params.sponsor;
        this.action = data.params.action || {};
        this.logo = data.collateral.logo;
        this.links = data.links;
        this.ad = !!data.params.ad;

        this.data = {
            type: data.type,
            source: data.source,
            hideSource: !!data.data.hideSource,
            videoid: data.data.videoid,
            href: data.data.href,
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
