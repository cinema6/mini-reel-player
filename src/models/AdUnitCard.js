import VideoCard from './VideoCard.js';
import completeUrl from '../fns/complete_url.js';

export default class AdUnitCard extends VideoCard {
    constructor(card) {
        super(...arguments);

        this.data.type = 'vast';
        this.data.videoid = card.data.vast || card.data.vpaid;
        this.data.preload = true;
    }

    getSrc() {
        return completeUrl(this.data.videoid);
    }
}
