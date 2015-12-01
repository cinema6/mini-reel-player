import CardController from './CardController.js';
import { createKey } from 'private-parts';
import {
    map,
    find
} from '../../lib/utils.js';

class Private {
    formatTitle(title) {
        if(title && title.length > 100) {
            return title.substring(0, 100) + '...';
        } else {
            return title;
        }
    }
}

const _ = createKey(instance => new Private(instance));

export default class RecapCardController extends CardController {
    constructor() {
        super(...arguments);
        if (global.__karma__) { this.__private__ = _(this); }
    }

    addListeners() {
        const minireel = this.model.data;

        this.view.on('selectCard', id => {
            minireel.moveTo(find(minireel.deck, card => card.id === id));
        });
    }

    render() {
        this.view.update({
            cards: map(this.model.data.deck, card => ({
                id: card.get('id'),
                title: _(this).formatTitle(card.get('title')),
                note: card.get('note'),
                source: card.get('data.source'),
                href: card.get('data.href'),
                thumb: card.get('thumbs.small'),
                showSource: !!card.get('data.source') && !card.get('data.hideSource'),
                website: card.get('links.Website.uri'),
                sponsor: card.get('sponsor'),
                type: card.get('ad') ? 'ad' : 'content',
                links: card.get('socialLinks') || [],
                logo: card.get('logo'),
                isSponsored: !!(
                    card.get('sponsor') ||
                    (card.get('socialLinks') || []).length > 0 ||
                    card.get('logo')
                )
            }))
        });

        return super.render(...arguments);
    }
}
