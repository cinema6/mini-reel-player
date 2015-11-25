import VideoCardController from '../VideoCardController.js';
import LightVideoCardView from '../../views/light/LightVideoCardView.js';
import ModalBallotResultsVideoCardController
    from '../../mixins/ModalBallotResultsVideoCardController.js';
import ModalShareVideoCardController from '../../mixins/ModalShareVideoCardController.js';

export default class LightVideoCardController extends VideoCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightVideoCardView());

        this.initBallotResults();
        this.initShare();
    }
}
LightVideoCardController.mixin(ModalBallotResultsVideoCardController, ModalShareVideoCardController); // jshint ignore:line
