import VideoCard from './VideoCard.js';
import { extend } from '../../lib/utils.js';

export default class InstagramVideoCard extends VideoCard {
    constructor(data) {
        super(...arguments);
        this.type = 'instagramVideo';
        this.title = data.caption;
        this.data.href = data.href;
        this.data.src = data.data.src;
        this.user = extend(null, data.user);
        this.likes = data.likes;
        this.date = new Date(parseInt(data.date) * 1000);
        this.caption = data.caption;
        this.comments = data.comments;
    }
}