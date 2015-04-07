import PlayerView from '../PlayerView.js';
import PlaylistPlayerView from '../../mixins/PlaylistPlayerView.js';
import ResizingPlayerView from '../../mixins/ResizingPlayerView.js';
import ResizableNavButtonView from '../ResizableNavButtonView.js';
import LinksListView from '../LinksListView.js';
import View from '../../../lib/core/View.js';

export default class FullPlayerView extends PlayerView {
    constructor() {
        super(...arguments);

        this.template = require('./FullPlayerView.html');
        this.instantiates = {
            ResizableNavButtonView,
            LinksListView,
            View
        };
    }

    didCreateElement() {
        super();

        this.nextButtons.push(this.nextButton);
        this.previousButtons.push(this.previousButton);
        this.navItems.push(this.nextButton, this.previousButton);
    }
}
FullPlayerView.mixin(PlaylistPlayerView, ResizingPlayerView); // jshint ignore:line
