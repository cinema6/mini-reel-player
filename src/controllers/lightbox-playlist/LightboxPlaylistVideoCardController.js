import VideoCardController from '../VideoCardController.js';
import LightboxPlaylistVideoCardView
    from '../../views/lightbox-playlist/LightboxPlaylistVideoCardView.js';
import SkipTimerVideoCardController from '../../mixins/SkipTimerVideoCardController.js';
import ModalBallotResultsVideoCardController
    from '../../mixins/ModalBallotResultsVideoCardController.js';

export default class LightboxPlaylistVideoCardController extends VideoCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightboxPlaylistVideoCardView());

        this.initSkipTimer();
        this.initBallotResults();
    }
}
LightboxPlaylistVideoCardController.mixin( // jshint ignore:line
    SkipTimerVideoCardController,
    ModalBallotResultsVideoCardController
);
