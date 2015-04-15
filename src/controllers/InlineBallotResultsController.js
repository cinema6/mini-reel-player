import BallotResultsController from './BallotResultsController.js';
import InlineBallotResultsView from '../views/InlineBallotResultsView.js';

export default class InlineBallotResultsController extends BallotResultsController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new InlineBallotResultsView());
    }
}
