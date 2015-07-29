import ImageCard from './ImageCard.js';

export default class InstagramImageCard extends ImageCard {
    constructor(data) {
        super(...arguments);
        this.type = 'instagramImage';
        this.title = data.caption;
        this.thumbs = {
            small: null,
            large: null
        };
    }
}
