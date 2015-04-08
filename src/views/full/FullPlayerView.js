import PlayerView from '../PlayerView.js';
import ResizableNavButtonView from '../ResizableNavButtonView.js';
import LinksListView from '../LinksListView.js';
import View from '../../../lib/core/View.js';
import {
    forEach,
    extend
} from '../../../lib/utils.js';
import {createKey} from 'private-parts';

const _ = createKey();

const FULL_WIDTH_CLASS = 'cards__list--fullWidth';

export default class FullPlayerView extends PlayerView {
    constructor() {
        super(...arguments);

        _(this).buttonValues = {};

        this.template = require('./FullPlayerView.html');
        this.instantiates = {
            ResizableNavButtonView,
            LinksListView,
            View
        };

        _(this).navigationShown = true;
    }

    expand() {
        this.cards.addClass(FULL_WIDTH_CLASS);
        forEach(this.nextButtons, button => button.hide());
    }

    contract() {
        this.cards.removeClass(FULL_WIDTH_CLASS);
        if (_(this).navigationShown) {
            forEach(this.nextButtons, button => button.show());
        }
    }

    setButtonSize(size) {
        forEach(this.navItems, button => button.setSize(size));
    }

    disableNavigation() {
        forEach(this.navItems, button => button.disable());
        this.navEnabled = false;
    }

    enableNavigation() {
        forEach(this.navItems, button => button.enable());
        this.navEnabled = true;
        this.update(_(this).buttonValues);
    }

    hideNavigation() {
        _(this).navigationShown = false;
        return super();
    }

    showNavigation() {
        _(this).navigationShown = true;
        return super();
    }

    update(data) {
        if (this.navEnabled) {
            return super(data);
        } else {
            _(this).buttonValues = { canGoForward: data.canGoForward, canGoBack: data.canGoBack };
            return super(extend(data, { canGoForward: false, canGoBack: false }));
        }
    }

    didCreateElement() {
        super();

        this.nextButtons.push(this.nextButton);
        this.previousButtons.push(this.previousButton);
        this.navItems.push(this.nextButton, this.previousButton);
    }
}
