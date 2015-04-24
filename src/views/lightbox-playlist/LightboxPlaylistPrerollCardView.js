import CardView from '../CardView.js';
import View from '../../../lib/core/View.js';
import SkipTimerView from '../SkipTimerView.js';
import PlayerOutletView from '../PlayerOutletView.js';

export default class LightboxPlaylistPrerollCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightboxPlaylistPrerollCardView.html');
        this.instantiates = {View, SkipTimerView, PlayerOutletView};
    }
}
