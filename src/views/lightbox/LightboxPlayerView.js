import PlayerView from '../PlayerView.js';
import ButtonView from '../ButtonView.js';
import View from '../../../lib/core/View.js';
import LightboxNavButtonView from '../LightboxNavButtonView.js';
import LinksListView from '../LinksListView.js';
import DeckView from '../DeckView.js';

export default class LightboxPlayerView extends PlayerView {
    constructor() {
        super(...arguments);

        this.template = require('./LightboxPlayerView.html');
        this.instantiates = {
            ButtonView,
            LightboxNavButtonView,
            View,
            LinksListView,
            DeckView
        };
    }

    didCreateElement() {
        super();

        this.closeButtons.push(this.closeButton);
        this.previousButtons.push(this.previousButton);
        this.nextButtons.push(this.nextButton);
        this.navItems.push(this.previousButton, this.nextButton);

        this.enableNavigation();
    }
}
