import TemplateView from '../../lib/core/TemplateView.js';
import PlaylistCardListView from './PlaylistCardListView.js';
import Hideable from '../mixins/Hideable.js';
import {createKey} from 'private-parts';

const EXPANDED_CLASS = 'playlist__group--noAds';

const _ = createKey();

export default class PlaylistView extends TemplateView {
    constructor() {
        super(...arguments);

        _(this).cards = [];

        this.tag = 'div';
        this.classes.push('playlist__group');
        this.template = require('./PlaylistView.html');
        this.instantiates = {PlaylistCardListView};
    }

    didCreateElement() {
        super(...arguments);

        this.cards.on('addChild', (childView, index) => {
            const id = _(this).cards[index].id;
            childView.on('select', () => this.emit('selectCard', id));
        });
    }

    update(data) {
        _(this).cards = data.cards;

        super(data);
        this.cards.update(data.cards);

        if (data.expanded) {
            this.addClass(EXPANDED_CLASS);
        } else {
            this.removeClass(EXPANDED_CLASS);
        }
    }
}
PlaylistView.mixin(Hideable); // jshint ignore:line
