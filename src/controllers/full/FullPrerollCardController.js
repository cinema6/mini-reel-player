import PrerollCardController from '../PrerollCardController.js';
import FullPrerollCardView from '../../views/full/FullPrerollCardView.js';
import SkipTimerVideoCardController from '../../mixins/SkipTimerVideoCardController.js';

export default class FullPrerollCardController extends PrerollCardController {
    constructor() {
        super(...arguments);

        this.view = new FullPrerollCardView();

        this.initSkipTimer();
    }
}
FullPrerollCardController.mixin(SkipTimerVideoCardController); // jshint ignore:line
