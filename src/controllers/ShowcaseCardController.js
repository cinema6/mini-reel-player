import CardController from './CardController.js';
import SponsoredCardController from '../mixins/SponsoredCardController.js';
import dispatcher from '../services/dispatcher.js';

export default class ShowcaseCardController extends CardController {
    constructor(card) {
        super(...arguments);

        dispatcher.addSource('showcase-card', card, ['activate', 'deactivate']);
        dispatcher.addSource('card', card, [
            'activate', 'deactivate',
            'becameUnskippable', 'becameSkippable', 'skippableProgress'
        ]);
    }

    updateView() {
        const card = this.model;

        return this.view.update({
            sponsor: card.get('sponsor'),
            action: {
                label: 'Action',
                text: card.get('action.label'),
                href: card.get('links.Action.uri')
            }
        });
    }

    render() {
        this.updateView();

        return super.render(...arguments);
    }
}
ShowcaseCardController.mixin(SponsoredCardController);
