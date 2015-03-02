import CardView from './CardView.js';
import View from '../../lib/core/View.js';
import RecapCardItemView from './RecapCardItemView.js';
import {
    forEach
} from '../../lib/utils.js';

export default class RecapCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./RecapCardView.html');
        this.instantiates = {View};
    }

    update(data) {
        if (!this.cards) { this.create(); }

        forEach(data.cards || [], card => {
            const itemView = new RecapCardItemView();

            itemView.update(card);
            itemView.on('select', () => this.emit('selectCard', card.id));

            this.cards.append(itemView);
        });
    }
}
