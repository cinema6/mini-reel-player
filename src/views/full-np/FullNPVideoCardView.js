import VideoCardView from '../VideoCardView.js';
import LinksListView from '../LinksListView.js';
import PlayerOutletView from '../PlayerOutletView.js';
import SkipTimerView from '../SkipTimerView.js';
import View from '../../../lib/core/View.js';
import ButtonView from '../ButtonView.js';
import LinkItemView from '../LinkItemView.js';

export default class FullNPVideoCardView extends VideoCardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullNPVideoCardView.html');
        this.instantiates = {
            View,
            LinksListView,
            PlayerOutletView,
            SkipTimerView,
            ButtonView,
            LinkItemView
        };
    }

    didCreateElement() {
        super(...arguments);

        this.skipTimer.hide();
    }
}
