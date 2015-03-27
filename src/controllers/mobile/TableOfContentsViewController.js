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
                id: card.id,
                title: card.title,
                source: card.data.source,
                href: card.data.href,
                thumb: card.thumbs.small,
                showSource: !!card.data.source && !card.data.hideSource,
                sponsor: card.sponsor,
                website: (card.links || {}).Website,
                type: card.ad ? 'ad' : 'content'
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
