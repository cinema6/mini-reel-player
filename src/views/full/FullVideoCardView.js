import VideoCardView from '../VideoCardView.js';
import LinksListView from '../LinksListView.js';
import PlayerOutletView from '../PlayerOutletView.js';
import SkipTimerView from '../SkipTimerView.js';
import View from '../../../lib/core/View.js';
import AnchorView from '../AnchorView.js';

export default class FullVideoCardView extends VideoCardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullVideoCardView.html');
        this.instantiates = {View, LinksListView, PlayerOutletView, SkipTimerView, AnchorView};
    }

    didCreateElement() {
        super(...arguments);

        this.skipTimer.hide();
    }
}
