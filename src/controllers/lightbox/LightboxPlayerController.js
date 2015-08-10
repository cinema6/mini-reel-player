import PlayerController from '../PlayerController.js';
import LightboxPlayerView from '../../views/lightbox/LightboxPlayerView.js';
import LightboxArticleCardController from './LightboxArticleCardController.js';
import LightboxTextCardController from './LightboxTextCardController.js';
import LightboxImageCardController from './LightboxImageCardController.js';
import LightboxVideoCardController from './LightboxVideoCardController.js';
import LightboxPlaylistRecapCardController
    from '../lightbox-playlist/LightboxPlaylistRecapCardController.js';
import LightboxPrerollCardController from './LightboxPrerollCardController.js';
import DisplayAdCardController from '../DisplayAdCardController.js';
import FullscreenPlayerController from '../../mixins/FullscreenPlayerController.js';
import ThumbnailNavigatorPlayerController from '../../mixins/ThumbnailNavigatorPlayerController.js';
import FullPinterestImageCardController from '../full//FullPinterestImageCardController.js';
import FullPinterestVideoCardController from '../full//FullPinterestVideoCardController.js';

export default class LightboxPlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightboxPlayerView());

        this.CardControllers = {
            article: LightboxArticleCardController,
            text: LightboxTextCardController,
            image: LightboxImageCardController,
            video: LightboxVideoCardController,
            recap: LightboxPlaylistRecapCardController,
            preroll: LightboxPrerollCardController,
            displayAd: DisplayAdCardController,
            pinterestImage: FullPinterestImageCardController,
            pinterestVideo: FullPinterestVideoCardController
        };

        this.initFullscreen();
        this.initThumbnailNavigator();
    }
}
LightboxPlayerController.mixin(FullscreenPlayerController, ThumbnailNavigatorPlayerController); // jshint ignore:line
