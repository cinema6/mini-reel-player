import CardView from './CardView.js';
import RecapCardListView from './RecapCardListView.js';

export default class RecapCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./RecapCardView.html');
        this.instantiates = {RecapCardListView};
    }

    update(data) {
        if (!this.cards) { this.create(); }
        if (!data.cards) { return; }

        this.cards.on('addChild', (card, index) => {
            card.on('select', () => this.emit('selectCard', data.cards[index].id));
        });
        this.cards.update(data.cards);
    }
}
