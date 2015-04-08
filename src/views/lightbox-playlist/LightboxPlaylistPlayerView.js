import PlayerView from '../PlayerView.js';
import View from '../../../lib/core/View.js';
import ButtonView from '../ButtonView.js';
import LightboxNavButtonView from '../LightboxNavButtonView.js';
import LinksListView from '../LinksListView.js';
import PlaylistPlayerView from '../../mixins/PlaylistPlayerView.js';
import ResizingPlayerView from '../../mixins/ResizingPlayerView.js';

export default class LightboxPlaylistPlayerView extends PlayerView {
    constructor() {
        super(...arguments);

        this.template = require('./LightboxPlaylistPlayerView.html');
        this.instantiates = {
            View,
            ButtonView,
            LightboxNavButtonView,
            LinksListView,
        };
    }

    didCreateElement() {
        super();

        this.nextButtons.push(this.nextButton);
        this.previousButtons.push(this.previousButton);
        this.navItems.push(this.nextButton, this.previousButton);
        this.closeButtons.push(this.closeButton);

        this.enableNavigation();
    }
}
LightboxPlaylistPlayerView.mixin(PlaylistPlayerView, ResizingPlayerView); // jshint ignore:line
