import PlayerView from '../PlayerView.js';
import View from '../../../lib/core/View.js';
import NavbarView from './NavbarView.js';
import TOCButtonView from './TOCButtonView.js';
import NavButtonView from './NavButtonView.js';
import SkipTimerView from '../SkipTimerView.js';
import CloseButtonView from '../CloseButtonView.js';
import LinksListView from '../LinksListView.js';
import DeckView from '../DeckView.js';
import {
    forEach
} from '../../../lib/utils.js';

export default class MobilePlayerView extends PlayerView {
    constructor() {
        super(...arguments);

        this.template = require('./MobilePlayerView.html');

        this.instantiates = {
            View,
            NavbarView,
            TOCButtonView,
            CloseButtonView,
            NavButtonView,
            SkipTimerView,
            LinksListView,
            DeckView
        };

        this.tocButtons = [];
        this.chromeItems = [];
    }

    didCreateElement() {
        super.didCreateElement(...arguments);

        this.nextButtons.push(this.nextButton, this.landscapeNextButton);
        this.previousButtons.push(this.previousButton, this.landscapePreviousButton);
        this.closeButtons.push(this.closeButton, this.landscapeCloseButton, this.singleCloseButton);
        this.tocButtons.push(this.tocButton, this.landscapeTocButton);

        this.skipTimers.push(this.skipTimer, this.landscapeSkipTimer, this.closeSkipTimer);

        const navItems = [].concat(this.nextButtons, this.previousButtons);
        this.navItems.push(...navItems);
        const chromeItems = [this.navbar, this.landscapeLeftSidebar].concat(this.closeButtons);
        this.chromeItems.push(...chromeItems);

        this.enableNavigation();
    }

    update(data) {
        if (!data.thumbs) { return super.update(data); }

        forEach(this.nextButtons, button => {
            button.setThumb(data.thumbs.next);
        });

        forEach(this.previousButtons, button => {
            button.setThumb(data.thumbs.previous);
        });

        return super.update(data);
    }

    hideNavigation() {
        forEach(this.tocButtons, view => view.hide());
        return super.hideNavigation(...arguments);
    }

    showNavigation() {
        forEach(this.tocButtons, view => view.show());
        return super.showNavigation(...arguments);
    }

    hideChrome() {
        this.hidePaginators();
        forEach(this.chromeItems, view => view.hide());
    }

    showChrome() {
        this.showPaginators();
        forEach(this.chromeItems, view => view.show());
    }
}
