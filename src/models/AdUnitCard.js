import VideoCard from './VideoCard.js';
import completeUrl from '../fns/complete_url.js';

export default class AdUnitCard extends VideoCard {
    constructor(card) {
        super(...arguments);

        this.data.type = 'vast';
        this.data.videoid = card.data.vast;
        this.data.preload = true;
        this.data.autoplay = true;
    }

    getSrc() {
        return completeUrl(this.data.videoid);
    }
}
