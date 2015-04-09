import VideoCardView from '../VideoCardView.js';
import LinksListView from '../LinksListView.js';
import View from '../../../lib/core/View.js';
import PlayerOutletView from '../PlayerOutletView.js';

export default class LightVideoCardView extends VideoCardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightVideoCardView.html');
        this.instantiates = {LinksListView, View, PlayerOutletView};
    }
}
