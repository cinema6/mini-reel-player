import CardView from '../CardView.js';
import SkipTimerView from '../SkipTimerView.js';

export default class LightboxPlaylistArticleCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightboxPlaylistArticleCardView.html');
        this.instantiates = {
            SkipTimerView
        };
    }

    didCreateElement() {
        super();

        this.skipTimer.hide();
    }
}
