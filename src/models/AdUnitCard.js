import VideoCard from './VideoCard.js';

export default class AdUnitCard extends VideoCard {
    constructor(card) {
        super(...arguments);

        this.data.videoid = card.data.vast;
    }
}
