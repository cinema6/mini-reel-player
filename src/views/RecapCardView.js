import CardView from './CardView.js';

export default class RecapCardView extends CardView {
    update(data) {
        if (!this.cards) { this.create(); }
        if (!data.cards) { return; }

        this.cards.on('addChild', (card, index) => {
            card.on('select', () => this.emit('selectCard', data.cards[index].id));
        });
        this.cards.update(data.cards);
    }
}
