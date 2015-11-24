import VideoCardController from '../VideoCardController.js';
import FullNPVideoCardView from '../../views/full-np/FullNPVideoCardView.js';
import SkipTimerVideoCardController from '../../mixins/SkipTimerVideoCardController.js';
import ModalBallotResultsVideoCardController
    from '../../mixins/ModalBallotResultsVideoCardController.js';
import ModalShareVideoCardController from '../../mixins/ModalShareVideoCardController.js';

export default class FullNPVideoCardController extends VideoCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullNPVideoCardView());

        this.initSkipTimer();
        this.initBallotResults();
        this.initShare();
    }
}
FullNPVideoCardController.mixin(SkipTimerVideoCardController, ModalBallotResultsVideoCardController, ModalShareVideoCardController); // jshint ignore:line
