import Card from './Card.js';

export default class TextCard extends Card {
    constructor(data, { data: { collateral: { splash } } }) {
        super(...arguments);

        this.type = 'text';
        this.thumbs = {
            small: splash,
            large: splash
        };
    }

    complete() {
        this.emit('canAdvance');
        return super.complete();
    }
}
