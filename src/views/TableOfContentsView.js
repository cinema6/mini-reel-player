import TemplateView from '../../lib/core/TemplateView.js';
import Hideable from '../mixins/Hideable.js';
import View from '../../lib/core/View.js';
import TableOfContentsCardView from './TableOfContentsCardView.js';
import {
    map,
    forEach
} from '../../lib/utils.js';

class TableOfContentsView extends TemplateView {
    constructor() {
        super(...arguments);

        this.tag = 'section';
        this.classes.push('css-promote', 'toc__group');
        this.template = require('./TableOfContentsView.html');
        this.instantiates.push(View);

        this.cards = [];
    }

    update(data) {
        super({ title: data.title });

        this.cards = map(data.cards, () => new TableOfContentsCardView());
        forEach(this.cards, (card, index) => {
            const cardData = data.cards[index];

            card.update(cardData);
            card.on('select', () => this.emit('selectCard', cardData.id));

            this.list.append(card);
        });
    }
}
TableOfContentsView.mixin(Hideable);

export default TableOfContentsView;
