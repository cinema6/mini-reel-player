import TemplateView from '../../../lib/core/TemplateView.js';
import TableOfContentsListView from './TableOfContentsListView.js';
import Hideable from '../../mixins/Hideable.js';

class TableOfContentsView extends TemplateView {
    constructor() {
        super(...arguments);

        this.tag = 'section';
        this.id = 'toc';
        this.classes.push('css-promote', 'toc__group');
        this.template = require('./TableOfContentsView.html');
        this.instantiates = {TableOfContentsListView};
    }

    update(data) {
        super.update({ title: data.title });

        this.list.on('addChild', (card, index) => {
            card.on('select', () => this.emit('selectCard', data.cards[index].id));
        });
        this.list.update(data.cards);
    }
}
TableOfContentsView.mixin(Hideable);

export default TableOfContentsView;
