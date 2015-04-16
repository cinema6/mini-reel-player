import BallotResultsView from './BallotResultsView.js';
import ButtonView from './ButtonView.js';

export default class ModalBallotResultsView extends BallotResultsView {
    constructor() {
        super(...arguments);

        this.classes.push('ballot__group', 'results-module', 'playerHeight', 'player__height');
        this.template = require('./ModalBallotResultsView.html');
        this.instantiates = {ButtonView};
    }
}
