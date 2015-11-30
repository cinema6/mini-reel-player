import ModuleController from '../ModuleController.js';
import SwipeBallotView from '../../views/swipe/SwipeBallotView.js';

export default class SwipePostController extends ModuleController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new SwipeBallotView());
    }

    vote(button) {
        this.model.ballot.cast(parseInt(button.attributes['data-vote'], 10));
        this.emit('vote');
    }

    updateView() {
        const { model: { ballot: { prompt, choices } } } = this;

        this.view.update({
            resultsShown: false,
            prompt, choices
        });
    }

    renderInto() {
        this.updateView();
        return super.renderInto(...arguments);
    }
}
