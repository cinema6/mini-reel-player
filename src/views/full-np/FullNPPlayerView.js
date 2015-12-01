import PlayerView from '../PlayerView.js';
import LinksListView from '../LinksListView.js';
import DeckView from '../DeckView.js';
import View from '../../../lib/core/View.js';

export default class FullNPPlayerView extends PlayerView {
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
        super.didCreateElement();

        this.enableNavigation();
    }
}
