import VideoCardController from '../VideoCardController.js';
import DesktopCardVideoCardView from '../../views/desktop-card/DesktopCardVideoCardView.js';
import ModalBallotResultsVideoCardController from
    '../../mixins/ModalBallotResultsVideoCardController.js';
import ModalShareVideoCardController from '../../mixins/ModalShareVideoCardController.js';

export default class DesktopCardVideoCardController extends VideoCardController {
    constructor(card, rootView) {
        super(card, rootView);

        this.view = this.addView(new DesktopCardVideoCardView());

        this.initBallotResults();
        this.initShare();
    }
}
DesktopCardVideoCardController.mixin( // jshint ignore:line
    ModalBallotResultsVideoCardController,
    ModalShareVideoCardController
);
