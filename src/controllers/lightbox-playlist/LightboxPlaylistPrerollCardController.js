import PrerollCardController from '../PrerollCardController.js';
import LightboxPlaylistPrerollCardView
    from '../../views/lightbox-playlist/LightboxPlaylistPrerollCardView.js';
import SkipTimerVideoCardController from '../../mixins/SkipTimerVideoCardController.js';

export default class LightboxPlaylistPrerollCardController extends PrerollCardController {
    constructor() {
        super(...arguments);

        this.view = new LightboxPlaylistPrerollCardView();

        this.initSkipTimer();
    }
}
LightboxPlaylistPrerollCardController.mixin(SkipTimerVideoCardController); // jshint ignore:line
