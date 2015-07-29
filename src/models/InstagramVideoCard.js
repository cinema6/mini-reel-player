import VideoCard from './VideoCard.js';

export default class InstagramVideoCard extends VideoCard {
    constructor(data) {
        super(...arguments);
        this.type = 'instagramVideo';
        this.title = data.caption;
    }
}
