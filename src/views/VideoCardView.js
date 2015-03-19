import CardView from './CardView.js';
import View from '../../lib/core/View.js';
import PlayerOutletView from './PlayerOutletView.js';
import LinksListView from './LinksListView.js';
import HideableView from './HideableView.js';
import ButtonView from './ButtonView.js';
import {
    extend
} from '../../lib/utils.js';

export default class VideoCardView extends CardView {
    constructor() {
        super(...arguments);

        this.instantiates = {View, LinksListView, PlayerOutletView, HideableView, ButtonView};
        this.template = require('./VideoCardView.html');

        this.moduleOutlets = {};
    }

    update(data) {
        if (!data.links) { return super(data); }

        super(extend(data, {
            isSponsored: !!(data.logo || data.links.length > 0 || data.sponsor),
            hasSponsoredCopy: !!(data.links.length > 0 || data.sponsor)
        }));
        this.links.update(data.links);
    }

    didCreateElement() {
        super(...arguments);

        this.replayContainer.hide();
        this.moduleOutlets = {
            displayAd: this.displayAdOutlet
        };

        this.replayButton.on('press', () => this.emit('replay'));
    }
}
