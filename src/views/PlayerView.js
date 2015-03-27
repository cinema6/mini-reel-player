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

        _(this).navigationShown = true;
    }

    didCreateElement() {
        super(...arguments);

        this.enableNavigation();
    }

    addListeners() {
        const next = () => this.emit('next');
        const previous = () => this.emit('previous');
        const close = () => this.emit('close');

        forEach(this.nextButtons, button => button.on('press', next));
        forEach(this.previousButtons, button => button.on('press', previous));
        forEach(this.closeButtons, button => button.on('press', close));
    }

    update(data) {
        super(...arguments);

        forEach(this.nextButtons, button => {
            if (data.canGoForward) { button.enable(); } else { button.disable(); }
        });

        forEach(this.previousButtons, button => {
            if (data.canGoBack) { button.enable(); } else { button.disable(); }
        });
    }

    disableNavigation() {
        forEach(this.skipTimers, timer => timer.show());
        this.hideNavigation();
    }

    enableNavigation() {
        forEach(this.skipTimers, timer => timer.hide());
        this.showNavigation();
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
