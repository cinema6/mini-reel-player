import VideoCardController from '../VideoCardController.js';
import MobileVideoCardView from '../../views/mobile/MobileVideoCardView.js';
import InlineBallotResultsVideoCardController
    from '../../mixins/InlineBallotResultsVideoCardController.js';
import ModalShareVideoCardController from '../../mixins/ModalShareVideoCardController.js';

export default class MobileVideoCardController extends VideoCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobileVideoCardView());

        this.initBallotResults();
        this.initShare();
    }
}
MobileVideoCardController.mixin(InlineBallotResultsVideoCardController, ModalShareVideoCardController); // jshint ignore:line
