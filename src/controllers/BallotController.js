import ModuleController from './ModuleController.js';
import BallotView from '../views/BallotView.js';

export default class BallotController extends ModuleController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new BallotView());
    }

    updateView() {
        return this.view.update({
            prompt: this.model.prompt,
            choices: this.model.choices
        });
    }

    activate() {
        this.updateView();
        return super();
    }

    vote(button) {
        this.model.cast(parseInt(button.attributes['data-vote'], 10));
        this.emit('voted');
        return this.deactivate();
    }
}
