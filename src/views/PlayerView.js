import TemplateView from '../../lib/core/TemplateView.js';
import View from '../../lib/core/View.js';
import ButtonView from './ButtonView.js';
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
            ButtonView,
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

        this.navItems = [
            this.navbar,
            this.landscapeLeftSidebar
        ].concat(
            this.nextButtons,
            this.previousButtons,
            this.closeButtons
        );

        forEach(this.nextButtons, button => button.on('press', next));
        forEach(this.previousButtons, button => button.on('press', previous));
        forEach(this.closeButtons, button => button.on('press', close));
        forEach([this.tocButton, this.landscapeTocButton], button => button.on('press', toggleToc));

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
        forEach(this.navItems, view => view.hide());
        _(this).navigationShown = false;
    }

    showNavigation() {
        forEach(this.navItems, view => view.show());
        _(this).navigationShown = true;
    }

    toggleNavigation() {
        this[_(this).navigationShown ? 'hideNavigation' : 'showNavigation']();
    }
}
