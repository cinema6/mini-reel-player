import PrerollCardController from '../PrerollCardController.js';
import FullPrerollCardView from '../../views/full/FullPrerollCardView.js';
import SkipTimerVideoCardController from '../../mixins/SkipTimerVideoCardController.js';
import CompanionPrerollCardController from '../../mixins/CompanionPrerollCardController.js';

export default class FullPrerollCardController extends PrerollCardController {
    constructor() {
        super(...arguments);

        this.view = new FullPrerollCardView();

        this.initSkipTimer();
        this.initCompanion();
    }
}
FullPrerollCardController.mixin( // jshint ignore:line
    SkipTimerVideoCardController,
    CompanionPrerollCardController
);
