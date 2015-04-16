import VideoCardController from '../VideoCardController.js';
import LightVideoCardView from '../../views/light/LightVideoCardView.js';
import ModalBallotResultsVideoCardController
    from '../../mixins/ModalBallotResultsVideoCardController.js';

export default class LightVideoCardController extends VideoCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightVideoCardView());

        this.initBallotResults();
    }
}
LightVideoCardController.mixin(ModalBallotResultsVideoCardController); // jshint ignore:line
