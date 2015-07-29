import ImageCard from './ImageCard.js';

export default class TwitterImageCard extends ImageCard {
    constructor(data) {
        super(...arguments);

        this.type = 'twitterImage';
        this.data.source = data.source;
        this.data.href = data.href;
    }
}
