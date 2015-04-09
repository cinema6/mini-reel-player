import VideoCardView from '../VideoCardView.js';
import View from '../../../lib/core/View.js';
import PlayerOutletView from '../PlayerOutletView.js';
import LinksListView from '../LinksListView.js';

export default class LightboxVideoCardView extends VideoCardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightboxVideoCardView.html');
        this.instantiates = {
            View,
            PlayerOutletView,
            LinksListView
        };
    }
}
