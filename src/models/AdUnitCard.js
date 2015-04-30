import VideoCard from './VideoCard.js';

export default class AdUnitCard extends VideoCard {
    constructor(card, experience, profile) {
        super(...arguments);

        this.data.type = (profile.flash && card.data.vpaid) ? 'vpaid' : 'vast';
        this.data.videoid = card.data[this.data.type];
    }
}
