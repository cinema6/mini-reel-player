import VideoCardView from '../VideoCardView.js';
import LinksListView from '../LinksListView.js';
import PlayerOutletView from '../PlayerOutletView.js';
import SkipTimerView from '../SkipTimerView.js';

export default class FullVideoCardView extends VideoCardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullVideoCardView.html');
        this.instantiates = {LinksListView, PlayerOutletView, SkipTimerView};
    }

    didCreateElement() {
        super(...arguments);

        this.skipTimer.hide();
    }
}
