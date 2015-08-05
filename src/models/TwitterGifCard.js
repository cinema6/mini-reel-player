import ImageCard from './ImageCard.js';

export default class TwitterGifCard extends ImageCard {
    constructor(data) {
        super(...arguments);

        this.type = 'twitterGif';
        this.data.source = data.source;
        this.data.href = data.href;
    }
}
