import ImageCard from './ImageCard.js';
import { extend } from '../../lib/utils.js';

export default class InstagramImageCard extends ImageCard {
    constructor(data) {
        super(...arguments);
        this.type = 'instagramImage';
        this.hideTitle = false;
        if(!this.title) {
            this.title = data.caption;
            this.hideTitle = true;
        }
        this.data.source = data.source;
        this.data.href = data.href;
        this.user = extend(null, data.user);
        this.likes = data.likes;
        this.date = new Date(parseInt(data.date) * 1000);
        this.caption = data.caption;
        this.comments = data.comments;
    }
}
