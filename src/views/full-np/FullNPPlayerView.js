import PlayerView from '../PlayerView.js';
import PlaylistPlayerView from '../../mixins/PlaylistPlayerView.js';
import ResizingPlayerView from '../../mixins/ResizingPlayerView.js';
import LinksListView from '../LinksListView.js';
import DeckView from '../DeckView.js';
import View from '../../../lib/core/View.js';

export default class FullPlayerView extends PlayerView {
    constructor() {
        super(...arguments);

        this.template = require('./FullNPPlayerView.html');
        this.instantiates = {
            View,
            LinksListView,
            DeckView
        };
    }

    didCreateElement() {
        super();

        this.enableNavigation();
    }
}
FullPlayerView.mixin(PlaylistPlayerView, ResizingPlayerView); // jshint ignore:line
