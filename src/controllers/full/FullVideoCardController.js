import VideoCardController from '../VideoCardController.js';
import FullVideoCardView from '../../views/full/FullVideoCardView.js';
import SkipTimerVideoCardController from '../../mixins/SkipTimerVideoCardController.js';

export default class FullVideoCardController extends VideoCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullVideoCardView());

        this.initSkipTimer();
    }
}
FullVideoCardController.mixin(SkipTimerVideoCardController); // jshint ignore:line
