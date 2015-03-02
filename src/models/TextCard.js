import Card from './Card.js';

export default class TextCard extends Card {
    constructor(data, splash) {
        super(...arguments);

        this.type = 'text';
        this.thumbs = {
            small: splash,
            large: splash
        };
    }
}
