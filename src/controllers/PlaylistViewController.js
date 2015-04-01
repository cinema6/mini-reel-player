import ViewController from './ViewController.js';
import PlaylistView from '../views/PlaylistView.js';
import {
    map,
    find
} from '../../lib/utils.js';

export default class PlaylistViewController extends ViewController {
    constructor(minireel) {
        super(...arguments);

        this.minireel = minireel;
        this.view = new PlaylistView();

        this.enabled = true;
        this.expanded = true;

        this.addListeners();
    }

    addListeners() {
        this.minireel.once('init', () => this.updateView());
        this.minireel.on('move', () => this.updateView());

        this.view.on('selectCard', id => {
            this.minireel.moveTo(find(this.minireel.deck, card => card.id === id));
        });
    }

    hide() {
        this.view.hide();
    }

    show() {
        this.view.show();
    }

    disable() {
        this.enabled = false;
        this.updateView();
    }

    enable() {
        this.enabled = true;
        this.updateView();
    }

    contract() {
        this.expanded = false;
        this.updateView();
    }

    expand() {
        this.expanded = true;
        this.updateView();
    }

    updateView() {
        const { minireel } = this;

        this.view.update({
            cardNumber: minireel.currentIndex + 1,
            total: minireel.length,
            enabled: this.enabled,
            expanded: this.expanded,
            cards: map(minireel.deck, card => ({
                id: card.id,
                title: card.title,
                thumb: card.thumbs.small,
                showSource: !!card.data.source && !card.data.hideSource,
                href: card.data.href,
                source: card.data.source,
                website: (card.links || {}).Website,
                sponsor: card.sponsor,
                ad: card.ad,
                active: card === minireel.currentCard
            }))
        });
    }
}
