import Card from './Card.js';

export default class ImageCard extends Card {
    constructor(data, { data: { collateral: { splash } } }) {
        super(...arguments);

        this.type = 'image';
        this.thumbs = {
            small: splash,
            large: splash
        };
        this.embedCode = data.data.embedCode;
    }

    complete() {
        this.emit('canAdvance');
        return super();
    }
}
