import CardController from './CardController.js';
import RecapCardView from '../views/RecapCardView.js';
import {
    map,
    find
} from '../../lib/utils.js';

export default class RecapCardController extends CardController {
    constructor() {
        super(...arguments);
        const minireel = this.model.data;

        this.view = new RecapCardView();
        this.view.on('selectCard', id => {
            minireel.moveTo(find(minireel.deck, card => card.id === id));
        });
    }

    render() {
        this.view.update({
            cards: map(this.model.data.deck, card => ({
                id: card.id,
                title: card.title,
                source: card.data.source,
                href: card.data.href,
                thumb: card.thumbs.small
            }))
        });

        return super(...arguments);
    }
}
