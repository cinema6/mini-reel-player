import BallotResultsController from './BallotResultsController.js';
import ModalBallotResultsView from '../views/ModalBallotResultsView.js';

export default class ModalBallotResultsController extends BallotResultsController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new ModalBallotResultsView());
    }
}
