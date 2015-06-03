import Controller from '../../lib/core/Controller.js';
import {createKey} from 'private-parts';
import {
    extend
} from '../../lib/utils.js';

const _ = createKey();

export default class CardController extends Controller {
    constructor(model, deckView) {
        super(...arguments);

        this.model = model;
        this.view = null;

        _(this).deck = deckView;

        model.on('activate', () => this.view.show());
        model.on('deactivate', () => this.view.hide());
    }

    render() {
        this.view.update({
            title: this.model.title,
            note: this.model.note,
            thumbs: extend(this.model.thumbs)
        });
        this.view.hide();

        _(this).deck.append(this.view);
    }
}
