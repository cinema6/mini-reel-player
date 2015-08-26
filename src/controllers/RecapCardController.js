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
                id: card.id,
                title: _(this).formatTitle(card.title),
                note: card.note,
                source: card.data.source,
                href: card.data.href,
                thumb: card.thumbs.small,
                showSource: !!card.data.source && !card.data.hideSource,
                website: (card.links || {}).Website,
                sponsor: card.sponsor,
                type: card.ad ? 'ad' : 'content',
                links: card.socialLinks || [],
                logo: card.logo,
                isSponsored: !!(card.sponsor || (card.socialLinks || []).length > 0 || card.logo)
            }))
        });

        return super(...arguments);
    }
}
