import ImageCard from './ImageCard.js';
import { extend } from '../../lib/utils.js';

export default class InstagramImageCard extends ImageCard {
    constructor(data) {
        super(...arguments);
        this.type = 'instagramImage';
        this.hideTitle = false;
        if(!this.title) {
            this.title = data.data.caption;
            this.hideTitle = true;
        }
        this.data = extend(this.data, {
            source: data.source,
            href: data.data.href,
            user: extend(null, data.data.user),
            likes: data.data.likes,
            date: new Date(parseInt(data.data.date) * 1000),
            caption: data.data.caption,
            comments: data.data.comments
        });
    }
}
