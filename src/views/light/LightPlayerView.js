import PlayerView from '../PlayerView.js';
import View from '../../../lib/core/View.js';
import LinksListView from '../LinksListView.js';
import DeckView from '../DeckView.js';

export default class LightPlayerView extends PlayerView {
    constructor() {
        super(...arguments);

        this.template = require('./LightPlayerView.html');
        this.instantiates = {View, LinksListView, DeckView};
    }
}
