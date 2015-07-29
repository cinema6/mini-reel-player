import VideoCard from './VideoCard.js';

export default class TwitterVideoCard extends VideoCard {
    constructor(data) {
        super(...arguments);

        this.type = 'twitterVideo';
        this.data.href = data.href;
    }
}
