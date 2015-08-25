import VideoCard from './VideoCard.js';
import { extend } from '../../lib/utils.js';

export default class InstagramVideoCard extends VideoCard {
    constructor(data) {
        super(...arguments);
        this.type = 'instagramVideo';
        this.hideTitle = false;
        if(!this.title) {
            this.title = data.data.caption;
            this.hideTitle = true;
        }
        this.data = extend(this.data, {
            href: data.data.href,
            src: data.data.src,
            user: extend(null, data.data.user),
            likes: data.data.likes,
            date: new Date(parseInt(data.data.date) * 1000),
            caption: data.data.caption,
            comments: data.data.comments
        });
    }
}
