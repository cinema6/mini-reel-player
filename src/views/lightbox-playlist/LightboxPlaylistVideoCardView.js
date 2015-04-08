import VideoCardView from '../VideoCardView.js';
import View from '../../../lib/core/View.js';
import PlayerOutletView from '../PlayerOutletView.js';
import SkipTimerView from '../SkipTimerView.js';
import LinksListView from '../LinksListView.js';

export default class LightboxPlaylistVideoCardView extends VideoCardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightboxPlaylistVideoCardView.html');
        this.instantiates = {
            View,
            PlayerOutletView,
            SkipTimerView,
            LinksListView
        };
    }

    didCreateElement() {
        super();

        this.skipTimer.hide();
    }
}
