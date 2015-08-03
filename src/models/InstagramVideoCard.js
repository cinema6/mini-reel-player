import VideoCard from './VideoCard.js';

export default class InstagramVideoCard extends VideoCard {
    constructor(data) {
        super(...arguments);
        this.type = 'instagramVideo';
        this.title = data.caption;
        this.data.href = data.href;
        this.user = {
            href: data.user.href
        };
    }
}