import PlayerView from '../PlayerView.js';
import DeckView from '../DeckView.js';
import LinksListView from '../LinksListView.js';

export default class SoloPlayerView extends PlayerView {
    constructor() {
        super(...arguments);

        this.template = require('./SoloPlayerView.html');
        this.instantiates = {DeckView};

        this.links = new LinksListView();
    }
}
