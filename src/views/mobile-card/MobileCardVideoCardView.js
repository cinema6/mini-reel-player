import VideoCardView from '../VideoCardView.js';
import LinksListView from '../LinksListView.js';
import View from '../../../lib/core/View.js';
import PlayerOutletView from '../PlayerOutletView.js';
import ButtonView from '../ButtonView.js';
import LinkItemView from '../LinkItemView.js';

export default class MobileCardVideoCardView extends VideoCardView {
    constructor() {
        super(...arguments);

        this.template = require('./MobileCardVideoCardView.html');
        this.instantiates = { LinksListView, View, PlayerOutletView, ButtonView, LinkItemView };
    }
}
