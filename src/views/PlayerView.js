import TemplateView from '../../lib/core/TemplateView.js';
import View from '../../lib/core/View.js';
import TOCButtonView from './TOCButtonView.js';
import CloseButtonView from './CloseButtonView.js';
import NavButtonView from './NavButtonView.js';
import NavbarView from './NavbarView.js';
import SkipTimerView from './SkipTimerView.js';
import {createKey} from 'private-parts';
import {
    forEach
} from '../../lib/utils.js';

const _ = createKey();

export default class PlayerView extends TemplateView {
    constructor() {
        super(...arguments);

        this.tag = 'main';
        this.template = require('./PlayerView.html');

        this.instantiates = {
            View,
            NavbarView,
            TOCButtonView,
            CloseButtonView,
            NavButtonView,
            SkipTimerView
        };

        this.nextButtons = [];
        this.previousButtons = [];
        this.closeButtons = [];
        this.navItems = [];

        _(this).navigationShown = true;
    }

    didCreateElement() {
        super(...arguments);

        const next = () => this.emit('next');
        const previous = () => this.emit('previous');
        const close = () => this.emit('close');
        const toggleToc = () => this.emit('toggleToc');

        this.nextButtons = [this.nextButton, this.landscapeNextButton];
        this.previousButtons = [this.previousButton, this.landscapePreviousButton];
        this.closeButtons = [this.closeButton, this.landscapeCloseButton];
        this.tocButtons = [this.tocButton, this.landscapeTocButton];

        this.navItems = [].concat(this.nextButtons, this.previousButtons);
        this.chromeItems = [this.navbar, this.landscapeLeftSidebar].concat(this.closeButtons);

        forEach(this.nextButtons, button => button.on('press', next));
        forEach(this.previousButtons, button => button.on('press', previous));
        forEach(this.closeButtons, button => button.on('press', close));
        forEach(this.tocButtons, button => button.on('press', toggleToc));

        this.enableNavigation();
    }

    update(data) {
        super(...arguments);

        forEach(this.nextButtons, button => {
            if (data.canGoForward) {
                button.enable();
            } else {
                button.disable();
            }

            button.setThumb(data.thumbs.next);
        });

        forEach(this.previousButtons, button => {
            if (data.canGoBack) {
                button.enable();
            } else {
                button.disable();
            }

            button.setThumb(data.thumbs.previous);
        });
    }

    disableNavigation() {
        forEach([this.skipTimer, this.landscapeSkipTimer], timer => timer.show());
        this.hideNavigation();
    }

    enableNavigation() {
        forEach([this.skipTimer, this.landscapeSkipTimer], timer => timer.hide());
        this.showNavigation();
    }

    updateSkipTimer(time) {
        forEach([this.skipTimer, this.landscapeSkipTimer], timer => timer.update(time));
    }

    hideNavigation() {
        forEach(this.tocButtons, view => view.hide());
        this.hidePaginators();
        _(this).navigationShown = false;
    }

    showNavigation() {
        forEach(this.tocButtons, view => view.show());
        this.showPaginators();
        _(this).navigationShown = true;
    }

    hideChrome() {
        this.hidePaginators();
        forEach(this.chromeItems, view => view.hide());
    }

    showChrome() {
        this.showPaginators();
        forEach(this.chromeItems, view => view.show());
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
