import VideoCardView from '../VideoCardView.js';
import View from '../../../lib/core/View.js';
import LinksListView from '../LinksListView.js';
import PlayerOutletView from '../PlayerOutletView.js';
import HideableView from '../HideableView.js';
import ButtonView from '../ButtonView.js';

export default class MobileVideoCardView extends VideoCardView {
    constructor() {
        super(...arguments);

        this.instantiates = {View, LinksListView, PlayerOutletView, HideableView, ButtonView};
        this.template = require('./MobileVideoCardView.html');
    }

    didCreateElement() {
        super(...arguments);

        this.replayContainer.hide();
    }
}
