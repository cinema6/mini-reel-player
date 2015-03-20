import ModuleController from './ModuleController.js';
import PostView from '../views/PostView.js';
import PostBallotView from '../views/PostBallotView.js';
import Runner from '../../lib/Runner.js';

export default class PostController extends ModuleController {
    constructor() {
        super(...arguments);
        const hasBallot = !!this.model.ballot;

        this.view = hasBallot ? new PostBallotView() : new PostView();
    }

    renderInto(view) {
        const { ballot = null, website } = this.model; // jshint ignore:line

        this.view.on('replay', () => {
            this.emit('replay');
            this.deactivate();
        });
        this.view.on('vote', vote => {
            this.model.ballot.cast(vote);
            this.deactivate();

            Runner.runNext(() => {
                this.view.remove();

                this.view = new PostView();
                this.renderInto(view);
            });
        });
        this.view.on('close', () => this.deactivate());

        this.view.update({
            website,
            ballot: ballot && {
                prompt: ballot.prompt,
                choice1: ballot.choices[0],
                choice2: ballot.choices[1]
            }
        });

        return super(...arguments);
    }
}
