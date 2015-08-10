import Card from './Card.js';

export default class PinterestVideoCard extends Card {
    constructor(data) {
        super(...arguments);

        this.type = 'pinterestVideo';
        this.thumbs = {
            small: data.data.thumbs.small,
            large: data.data.thumbs.large
        };
        this.title = 'Pinterest Card';
    }
}
