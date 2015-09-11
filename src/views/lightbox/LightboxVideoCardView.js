import VideoCardView from '../VideoCardView.js';
import View from '../../../lib/core/View.js';
import PlayerOutletView from '../PlayerOutletView.js';
import LinksListView from '../LinksListView.js';
import ButtonView from '../ButtonView.js';
import LinkItemView from '../LinkItemView.js';

export default class LightboxVideoCardView extends VideoCardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightboxVideoCardView.html');
        this.instantiates = {
            View,
            PlayerOutletView,
            LinksListView,
            ButtonView,
            LinkItemView
        };
    }
}
