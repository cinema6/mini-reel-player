import CardView from '../CardView.js';
import ButtonView from '../ButtonView.js';

export default class LightboxTextCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightboxTextCardView.html');
        this.instantiates = {ButtonView};
    }
}
