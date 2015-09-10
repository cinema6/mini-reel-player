import VideoCardController from '../VideoCardController.js';
import FullVideoCardView from '../../views/full/FullVideoCardView.js';
import SkipTimerVideoCardController from '../../mixins/SkipTimerVideoCardController.js';
import ModalBallotResultsVideoCardController
    from '../../mixins/ModalBallotResultsVideoCardController.js';
import ModalShareVideoCardController from '../../mixins/ModalShareVideoCardController.js';

export default class FullVideoCardController extends VideoCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullVideoCardView());

        this.initSkipTimer();
        this.initBallotResults();
        this.initShare();
    }
}
FullVideoCardController.mixin(SkipTimerVideoCardController, ModalBallotResultsVideoCardController, ModalShareVideoCardController); // jshint ignore:line
