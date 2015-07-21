import VideoCard from './VideoCard.js';

export default class VineVideoCard extends VideoCard {
    constructor(card, experience) {
        super(card, experience);

        this.data.videoid = card.data.code;
    }
}
