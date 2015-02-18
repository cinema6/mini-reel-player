import Card from './Card.js';

export default class RecapCard extends Card {
    constructor(card, minireel) {
        super(...arguments);

        this.type = 'recap';
        this.data = minireel;
    }
}
