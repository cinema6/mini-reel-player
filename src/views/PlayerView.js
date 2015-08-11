import TemplateView from '../../lib/core/TemplateView.js';
import {createKey} from 'private-parts';
import {
    forEach
} from '../../lib/utils.js';

const _ = createKey();

export default class PlayerView extends TemplateView {
    constructor() {
        super(...arguments);

        this.tag = 'main';

        this.nextButtons = [];
        this.previousButtons = [];
        this.closeButtons = [];
        this.skipTimers = [];
        this.navItems = [];

        this.navEnabled = false;

        _(this).navigationShown = true;
    }

    update(data) {
        super(...arguments);

        if (data.links) { this.links.update(data.links); }

        if ('canGoForward' in data) {
            forEach(this.nextButtons, button => {
                if (data.canGoForward) { button.enable(); } else { button.disable(); }
            });
        }

        if ('canGoBack' in data) {
            forEach(this.previousButtons, button => {
                if (data.canGoBack) { button.enable(); } else { button.disable(); }
            });
        }
    }

    disableNavigation() {
        forEach(this.skipTimers, timer => timer.show());
        this.hideNavigation();
        this.navEnabled = false;
    }

    enableNavigation() {
        forEach(this.skipTimers, timer => timer.hide());
        this.showNavigation();
        this.navEnabled = true;
    }

    updateSkipTimer(time) {
        forEach(this.skipTimers, timer => timer.update(time));
    }

    hideNavigation() {
        this.hidePaginators();
        _(this).navigationShown = false;
    }

    showNavigation() {
        this.showPaginators();
        _(this).navigationShown = true;
    }

    hidePaginators() {
        forEach(this.navItems, view => view.hide());
    }

    showPaginators() {
        forEach(this.navItems, view => view.show());
    }

    toggleNavigation() {
        this[_(this).navigationShown ? 'hideNavigation' : 'showNavigation']();
    }
}
