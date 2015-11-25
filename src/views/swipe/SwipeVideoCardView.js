import VideoCardView from '../VideoCardView.js';
import PlayerOutletView from '../PlayerOutletView.js';
import LinksListView from '../LinksListView.js';
import View from '../../../lib/core/View.js';
import LinkItemView from '../LinkItemView.js';

export default class SwipeVideoCardView extends VideoCardView {
    constructor() {
        super(...arguments);

        this.template = require('./SwipeVideoCardView.html');
        this.instantiates = {View, PlayerOutletView, LinksListView, LinkItemView};

        this.flipped = false;
    }

    flip(yes) {
        if (yes === this.flipped) { return; }

        this.update({
            flipped: yes
        });
        this.flipped = yes;

        this.emit(yes ? 'flip' : 'unflip');
    }
}
