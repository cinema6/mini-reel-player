import PrerollCardController from '../PrerollCardController.js';
import SwipePrerollCardView from '../../views/swipe/SwipePrerollCardView.js';

export default class SwipePrerollCardController extends PrerollCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new SwipePrerollCardView());

        this.model.on('becameUnskippable', () => this.view.skipButton.disable());
        this.model.on('skippableProgress', remaining => this.view.skipButton.update(remaining));
        this.model.on('becameSkippable', () => this.view.skipButton.enable());
    }

    skip() {
        this.model.complete();
    }
}
