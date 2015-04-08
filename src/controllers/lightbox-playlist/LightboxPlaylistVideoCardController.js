import VideoCardController from '../VideoCardController.js';
import LightboxPlaylistVideoCardView
    from '../../views/lightbox-playlist/LightboxPlaylistVideoCardView.js';
import SkipTimerVideoCardController from '../../mixins/SkipTimerVideoCardController.js';

export default class LightboxPlaylistVideoCardController extends VideoCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightboxPlaylistVideoCardView());

        this.initSkipTimer();
    }
}
LightboxPlaylistVideoCardController.mixin(SkipTimerVideoCardController); // jshint ignore:line
