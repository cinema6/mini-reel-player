import PrerollCardController from '../PrerollCardController.js';
import LightboxPlaylistPrerollCardView
    from '../../views/lightbox-playlist/LightboxPlaylistPrerollCardView.js';
import SkipTimerVideoCardController from '../../mixins/SkipTimerVideoCardController.js';
import CompanionPrerollCardController from '../../mixins/CompanionPrerollCardController.js';

export default class LightboxPlaylistPrerollCardController extends PrerollCardController {
    constructor() {
        super(...arguments);

        this.view = new LightboxPlaylistPrerollCardView();

        this.initSkipTimer();
        this.initCompanion();
    }
}
LightboxPlaylistPrerollCardController.mixin( // jshint ignore:line
    SkipTimerVideoCardController,
    CompanionPrerollCardController
);
