import CardView from '../CardView.js';
import ButtonView from '../ButtonView.js';

export default class FullNPTextCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullNPTextCardView.html');
        this.instantiates = {ButtonView};
    }
}
