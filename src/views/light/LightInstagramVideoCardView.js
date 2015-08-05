import CardView from '../CardView.js';
import View from '../../../lib/core/View.js';
import HtmlVideoPlayer from '../../players/HtmlVideoPlayer.js';

export default class LightInstagramVideoCardView extends CardView {
    constructor() {
        super(...arguments);

        this.instantiates = { View, HtmlVideoPlayer };
        this.template = require('./LightInstagramVideoCardView.html');
    }
}
