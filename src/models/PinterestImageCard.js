import Card from './Card.js';

export default class PinterestImageCard extends Card {
    constructor(data) {
        super(...arguments);

        this.type = 'pinterestImage';
        this.thumbs = {
            small: data.data.thumbs.small,
            large: data.data.thumbs.large
        };
        this.title = 'Pinterest Card';
    }
}
