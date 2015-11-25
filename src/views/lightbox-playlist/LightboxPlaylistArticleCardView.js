import CardView from '../CardView.js';

export default class LightboxPlaylistArticleCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightboxPlaylistArticleCardView.html');
    }
}
