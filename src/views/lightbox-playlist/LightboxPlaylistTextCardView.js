import CardView from '../CardView.js';
import ButtonView from '../ButtonView.js';

export default class LightboxPlaylistTextCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightboxPlaylistTextCardView.html');
        this.instantiates = {ButtonView};
    }
}
