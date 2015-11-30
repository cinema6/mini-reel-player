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

        return super.updateView();
    }

    activate() {
        const { model: { choice } } = this;

        this.resultsShown = (Number(choice) === choice);
        return super.activate();
    }

    vote() {
        this.resultsShown = true;
        this.updateView();

        return super.vote(...arguments);
    }

    renderInto(view) {
        this.updateView();

        return super.renderInto(view);
    }
}
