import PlayerView from '../PlayerView.js';
import PlaylistPlayerView from '../../mixins/PlaylistPlayerView.js';
import ResizingPlayerView from '../../mixins/ResizingPlayerView.js';
import ResizableNavButtonView from '../ResizableNavButtonView.js';
import LinksListView from '../LinksListView.js';
import DeckView from '../DeckView.js';
import View from '../../../lib/core/View.js';

export default class FullPlayerView extends PlayerView {
    constructor() {
        super(...arguments);

        this.template = require('./FullNPPlayerView.html');
        this.instantiates = {
            View,
            ResizableNavButtonView,
            LinksListView,
            DeckView
        };
    }

    didCreateElement() {
        super();

        this.nextButtons.push(this.nextButton);
        this.previousButtons.push(this.previousButton);
        this.navItems.push(this.nextButton, this.previousButton);

        this.enableNavigation();
    }
}
FullPlayerView.mixin(PlaylistPlayerView, ResizingPlayerView); // jshint ignore:line
