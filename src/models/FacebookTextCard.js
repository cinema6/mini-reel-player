import TextCard from './TextCard.js';

export default class FacebookTextCard extends TextCard {
    constructor(data) {
        super(...arguments);

        this.type = 'facebookText';
        this.thumbs = {
            small: data.data.thumbs.small,
            large: data.data.thumbs.large
        };
        this.data = {
            source: data.source,
            href: data.href
        };
    }
}
