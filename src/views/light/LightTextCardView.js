import CardView from '../CardView.js';
import ButtonView from '../ButtonView.js';

export default class LightTextCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightTextCardView.html');
        this.instantiates = {ButtonView};
    }
}
