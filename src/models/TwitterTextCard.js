import TextCard from './TextCard.js';

export default class TwitterTextCard extends TextCard {
    constructor(data) {
        super(...arguments);

        this.type = 'twitterText';
        this.thumbs = data.data.thumbs;
        this.data.source = data.source;
        this.data.href = data.href;
    }
}
