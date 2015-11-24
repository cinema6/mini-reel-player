import VideoCardController from '../VideoCardController.js';
import LightboxVideoCardView from '../../views/lightbox/LightboxVideoCardView.js';
import ModalBallotResultsVideoCardController
    from '../../mixins/ModalBallotResultsVideoCardController.js';
import ModalShareVideoCardController from '../../mixins/ModalShareVideoCardController.js';

export default class LightboxVideoCardController extends VideoCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightboxVideoCardView());

        this.initBallotResults();
        this.initShare();
    }
}
LightboxVideoCardController.mixin( // jshint ignore:line
    ModalBallotResultsVideoCardController,
    ModalShareVideoCardController
);
