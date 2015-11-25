import VideoCardController from '../VideoCardController.js';
import FullNPVideoCardView from '../../views/full-np/FullNPVideoCardView.js';
import SkipTimerVideoCardController from '../../mixins/SkipTimerVideoCardController.js';
import ModalShareVideoCardController from '../../mixins/ModalShareVideoCardController.js';

export default class FullNPVideoCardController extends VideoCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullNPVideoCardView());

        this.initSkipTimer();
        this.initShare();
    }
}
FullNPVideoCardController.mixin(// jshint ignore:line
    SkipTimerVideoCardController,
    ModalShareVideoCardController
);
