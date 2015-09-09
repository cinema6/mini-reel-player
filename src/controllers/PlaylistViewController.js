import ViewController from './ViewController.js';
import PlaylistView from '../views/PlaylistView.js';
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

export default class PlaylistViewController extends ViewController {
    constructor(minireel) {
        super(...arguments);

        this.minireel = minireel;
        this.view = new PlaylistView();

        this.enabled = true;
        this.expanded = true;

        this.addListeners();

        if (global.__karma__) { this.__private__ = _(this); }
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
            cardNumber: minireel.get('currentIndex') + 1,
            total: minireel.get('length'),
            enabled: this.enabled,
            expanded: this.expanded,
            cards: map(minireel.get('deck'), card => ({
                id: card.get('id'),
                title: _(this).formatTitle(card.get('title')),
                thumb: card.get('thumbs.small'),
                showSource: !!card.get('data.source') && !card.get('data.hideSource'),
                href: card.get('data.href'),
                source: card.get('data.source'),
                website: card.get('links.Website.uri'),
                sponsor: card.get('sponsor'),
                ad: card.get('ad'),
                active: card === minireel.get('currentCard')
            }))
        });
    }
}
