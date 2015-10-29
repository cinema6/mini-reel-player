import VideoCardView from '../VideoCardView.js';
import SkipTimerView from '../SkipTimerView.js';
import View from '../../../lib/core/View.js';
import PlayerOutletView from '../PlayerOutletView.js';
import LinkItemView from '../LinkItemView.js';
import LinksListView from '../LinksListView.js';
import ButtonView from '../ButtonView.js';

export default class DesktopCardVideoCardView extends VideoCardView {
    constructor(element) {
        super(element);

        this.template = require('./DesktopCardVideoCardView.html');
        this.instantiates = {
            SkipTimerView,
            View,
            PlayerOutletView,
            LinkItemView,
            LinksListView,
            ButtonView
        };
    }
}
