import VideoCardView from '../VideoCardView.js';
import TemplateView from '../../../lib/core/TemplateView.js';
import View from '../../../lib/core/View.js';
import LinksListView from '../LinksListView.js';
import PlayerOutletView from '../PlayerOutletView.js';

export default class SoloAdsVideoCardView extends VideoCardView {
    constructor() {
        super(...arguments);

        this.tag = 'div';
        this.classes = new TemplateView().classes;
        this.template = require('./SoloAdsVideoCardView.html');
        this.instantiates = {View, LinksListView, PlayerOutletView};
    }
}
