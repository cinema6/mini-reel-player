import ViewController from './ViewController.js';
import ThumbnailNavigatorView from '../views/ThumbnailNavigatorView.js';
import Runner from '../../lib/Runner.js';
import {
    map,
    find
} from '../../lib/utils.js';

function set(Ctrl, prop, value, resize) {
    if (Ctrl[prop] === value) { return; }

    Ctrl[prop] = value;
    Ctrl.updateView();

    if (resize) {
        Runner.scheduleOnce('afterRender', Ctrl.view, 'resize');
    }
}

export default class ThumbnailNavigatorViewController extends ViewController {
    constructor(minireel) {
        super(...arguments);

        this.view = this.addView(new ThumbnailNavigatorView());
        this.model = minireel;

        this.enabled = true;
        this.expanded = false;
        this.thumbsShown = true;

        minireel.once('init', () => this.updateView());
        minireel.on('move', () => this.updateView());
        minireel.on('becameUnskippable', () => this.disable());
        minireel.on('skippableProgress', time => this.view.skipTimer.update(time));
        minireel.on('becameSkippable', () => this.enable());
    }

    previous() {
        this.model.previous();
    }

    next() {
        this.model.next();
    }

    jump(button) {
        this.model.moveTo(find(this.model.deck, card => card.id === button.itemId));
    }

    expand() {
        set(this, 'expanded', true, true);
    }

    contract() {
        set(this, 'expanded', false, true);
    }

    enable() {
        set(this, 'enabled', true);
    }

    disable() {
        set(this, 'enabled', false);
    }

    showThumbs() {
        set(this, 'thumbsShown', true, true);
    }

    hideThumbs() {
        set(this, 'thumbsShown', false, true);
    }

    updateView() {
        this.view.update({
            enabled: this.enabled,
            expanded: this.expanded,
            thumbsShown: this.thumbsShown,
            enablePrevious: !this.model.standalone || this.model.currentIndex > 0,
            enableNext: this.model.currentIndex < (this.model.length - 1),
            items: map(this.model.deck, (card, index) => ({
                id: card.id,
                title: `Video ${index + 1} : ${card.title}`,
                thumb: card.thumbs.small,
                ad: card.ad,
                active: this.model.currentCard === card
            }))
        });
    }
}
