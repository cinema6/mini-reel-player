import ImageCard from './ImageCard.js';

export default class FacebookImageCard extends ImageCard {
    constructor(data) {
        super(...arguments);

        this.type = 'facebookImage';
        this.data.source = data.source;
        this.data.href = data.href;
    }
}
