import PlayerView from '../PlayerView.js';
import CardPannerView from './CardPannerView.js';
import ButtonView from '../ButtonView.js';
import SkipProgressTimerView from './SkipProgressTimerView.js';
import LinksListView from '../LinksListView.js';
import View from '../../../lib/core/View.js';

export default class SwipePlayerView extends PlayerView {
    constructor() {
        super(...arguments);

        this.template = require('./SwipePlayerView.html');
        this.instantiates = {View, CardPannerView, ButtonView, SkipProgressTimerView};

        this.links = new LinksListView();
    }
}
