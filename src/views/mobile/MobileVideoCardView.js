import VideoCardView from '../VideoCardView.js';
import View from '../../../lib/core/View.js';
import LinksListView from '../LinksListView.js';
import PlayerOutletView from '../PlayerOutletView.js';
import HideableView from '../HideableView.js';
import ButtonView from '../ButtonView.js';
import ModalShareView from '../ModalShareView.js';
import AnchorView from '../AnchorView.js';

export default class MobileVideoCardView extends VideoCardView {
    constructor() {
        super(...arguments);

        this.instantiates = {View, LinksListView, PlayerOutletView, HideableView, ButtonView,
                             ModalShareView, AnchorView};
        this.template = require('./MobileVideoCardView.html');
    }

    didCreateElement() {
        super(...arguments);

        this.replayContainer.hide();
    }
}
