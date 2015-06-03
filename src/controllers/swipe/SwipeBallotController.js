import BallotController from '../BallotController.js';
import SwipeBallotView from '../../views/swipe/SwipeBallotView.js';
import BallotResultsController from '../BallotResultsController.js';

export default class SwipeBallotController extends BallotController {
    constructor(ballot, card) {
        super(ballot);

        this.card = card;
        this.view = this.addView(new SwipeBallotView());

        this.resultsShown = false;

        ballot.once('hasResults', () => this.updateView());
    }

    updateView() {
        this.view.update({
            background: this.card.thumbs.large,
            resultsShown: this.resultsShown
        });

        BallotResultsController.prototype.updateView.call(this);

        return super();
    }

    activate() {
        const { model: { choice } } = this;

        this.resultsShown = (Number(choice) === choice);
        return super();
    }

    vote() {
        this.resultsShown = true;
        this.updateView();

        return super(...arguments);
    }

    renderInto(view) {
        this.updateView();

        return super(view);
    }
}
