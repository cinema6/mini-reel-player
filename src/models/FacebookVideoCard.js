import VideoCard from './VideoCard.js';

export default class FacebookVideoCard extends VideoCard {
    constructor(data) {
        super(...arguments);

        this.type = 'facebookVideo';
        this.data.href = data.href;
    }
}
