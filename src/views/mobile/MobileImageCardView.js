import CardView from '../CardView.js';
import View from '../../../lib/core/View.js';
import LinksListView from '../LinksListView.js';
import PlayerOutletView from '../PlayerOutletView.js';
import HideableView from '../HideableView.js';
import ButtonView from '../ButtonView.js';

export default class MobileImageCardView extends CardView {
    constructor() {
        super(...arguments);

        this.instantiates = {View, LinksListView, PlayerOutletView, HideableView, ButtonView};
        this.template = require('./MobileImageCardView.html');
    }

    didCreateElement() {
        super(...arguments);

        this.replayContainer.hide();
    }
}
