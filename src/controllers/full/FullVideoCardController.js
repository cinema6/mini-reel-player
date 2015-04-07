import VideoCardController from '../VideoCardController.js';
import FullVideoCardView from '../../views/full/FullVideoCardView.js';

export default class FullVideoCardController extends VideoCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullVideoCardView());

        this.model.on('becameUnskippable', () => this.view.skipTimer.show());
        this.model.on('becameSkippable', () => this.view.skipTimer.hide());
        this.model.on('skippableProgress', remaining => this.view.skipTimer.update(remaining));
    }
}
