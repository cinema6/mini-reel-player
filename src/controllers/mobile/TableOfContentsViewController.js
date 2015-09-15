import {createKey} from 'private-parts';
import ViewController from '../ViewController.js';
import Runner from '../../../lib/Runner.js';
import TableOfContentsView from '../../views/mobile/TableOfContentsView.js';
import {
    find,
    map
} from '../../../lib/utils.js';

const _ = createKey();

export default class TableOfContentsViewController extends ViewController {
    constructor(minireel) {
        super(...arguments);

        this.view = new TableOfContentsView();

        this.view.on('selectCard',id => {
            minireel.moveTo(find(minireel.deck, card => card.id === id));
            this.hide();
        });

        minireel.once('launch', () => Runner.runNext(() => this.view.update({
            title: minireel.title,
            cards: map(minireel.deck, card => ({
                id: card.get('id'),
                title: card.get('title'),
                source: card.get('data.source'),
                href: card.get('data.href'),
                thumb: card.get('thumbs.small'),
                showSource: !!card.get('data.source') && !card.get('data.hideSource'),
                sponsor: card.get('sponsor'),
                website: card.get('links.Website.uri'),
                type: card.get('ad') ? 'ad' : 'content'
            }))
        })));

        this.hide();
    }

    show() {
        this.view.show();
        _(this).shown = true;
        this.emit('show');
    }

    hide() {
        this.view.hide();
        _(this).shown = false;
        this.emit('hide');
    }

    toggle() {
        this[_(this).shown ? 'hide' : 'show']();
    }
}
