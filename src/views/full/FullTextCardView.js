import CardView from '../CardView.js';
import ButtonView from '../ButtonView.js';

export default class FullTextCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullTextCardView.html');
        this.instantiates = {ButtonView};
    }

    didCreateElement() {
        super(...arguments);
        this.addListeners();
    }

    addListeners() {
        this.startButton.on('press', () => this.emit('advance'));
    }
}
