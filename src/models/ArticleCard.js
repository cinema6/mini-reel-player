import Card from './Card.js';

export default class ArticleCard extends Card {
    constructor(data) {
        super(...arguments);

        this.type = 'article';
        this.thumbs = {
            small: data.data.thumbs.small,
            large: data.data.thumbs.large
        };
        this.data = {
            src: data.data.src
        };
    }

    complete() {
        this.emit('canAdvance');
        return super();
    }
}
