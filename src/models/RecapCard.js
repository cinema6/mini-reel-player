import Card from './Card.js';

export default class RecapCard extends Card {
    constructor(card, experience, minireel) {
        super(...arguments);

        const {splash} = minireel;

        this.type = 'recap';
        this.thumbs = {
            small: splash,
            large: splash
        };
        this.data = minireel;
    }
}
