import PlayerController from '../PlayerController.js';
import LightboxPlayerView from '../../views/lightbox/LightboxPlayerView.js';
import LightboxArticleCardController from './LightboxArticleCardController.js';
import LightboxTextCardController from './LightboxTextCardController.js';
import LightboxImageCardController from './LightboxImageCardController.js';
import LightboxVideoCardController from './LightboxVideoCardController.js';
import LightboxRecapCardController from './LightboxRecapCardController.js';
import LightboxPrerollCardController from './LightboxPrerollCardController.js';
import DisplayAdCardController from '../DisplayAdCardController.js';
import FullNPInstagramImageCardController from '../full-np/FullNPInstagramImageCardController.js';
import FullNPInstagramVideoCardController from '../full-np/FullNPInstagramVideoCardController.js';
import FullscreenPlayerController from '../../mixins/FullscreenPlayerController.js';
import ThumbnailNavigatorPlayerController from '../../mixins/ThumbnailNavigatorPlayerController.js';

export default class LightboxPlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightboxPlayerView());

        this.CardControllers = {
            article: LightboxArticleCardController,
            text: LightboxTextCardController,
            image: LightboxImageCardController,
            video: LightboxVideoCardController,
            recap: LightboxRecapCardController,
            preroll: LightboxPrerollCardController,
            displayAd: DisplayAdCardController,
            instagramImage: FullNPInstagramImageCardController,
            instagramVideo: FullNPInstagramVideoCardController
        };

        this.initFullscreen();
        this.initThumbnailNavigator();
    }
}
LightboxPlayerController.mixin(FullscreenPlayerController, ThumbnailNavigatorPlayerController); // jshint ignore:line
