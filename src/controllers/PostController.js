import ModuleController from './ModuleController.js';
import PostView from '../views/PostView.js';
import PostBallotView from '../views/PostBallotView.js';
import Runner from '../../lib/Runner.js';
import {createKey} from 'private-parts';

const _ = createKey();

export default class PostController extends ModuleController {
    constructor() {
        super(...arguments);
        const hasBallot = !!this.model.ballot;

        this.view = this.addView(hasBallot ? new PostBallotView() : new PostView());

        _(this).parentView = null;
    }

    replay() {
        this.emit('replay');
        this.deactivate();
    }

    vote(button) {
        const choice = ((() => {
            switch (button.id) {
            case 'post-module-vote1':
                return 0;
            case 'post-module-vote2':
                return 1;
            }
        })());

        this.model.ballot.cast(choice);
        this.deactivate();

        Runner.runNext(() => {
            this.view.destroy();

            this.view = this.addView(new PostView());
            this.renderInto(_(this).parentView);
        });
    }

    renderInto(view) {
        const { ballot = null, website } = this.model; // jshint ignore:line

        _(this).parentView = view;

        this.view.update({
            website: website && website.uri,
            ballot: ballot && {
                prompt: ballot.prompt,
                choice1: ballot.choices[0],
                choice2: ballot.choices[1]
            }
        });

        return super.renderInto(...arguments);
    }
}
