import PlayerController from '../PlayerController.js';
import LightboxPlaylistPlayerView
    from '../../views/lightbox-playlist/LightboxPlaylistPlayerView.js';
    import LightboxPlaylistArticleCardController from './LightboxPlaylistArticleCardController.js';
import LightboxPlaylistTextCardController from './LightboxPlaylistTextCardController.js';
import LightboxPlaylistImageCardController from './LightboxPlaylistImageCardController.js';
import LightboxPlaylistVideoCardController from './LightboxPlaylistVideoCardController.js';
import LightboxPlaylistRecapCardController from './LightboxPlaylistRecapCardController.js';
import LightboxPlaylistPrerollCardController from './LightboxPlaylistPrerollCardController.js';
import DisplayAdCardController from '../DisplayAdCardController.js';
import PlaylistPlayerController from '../../mixins/PlaylistPlayerController.js';
import FullscreenPlayerController from '../../mixins/FullscreenPlayerController.js';
import FullPinterestImageCardController from '../full//FullPinterestImageCardController.js';
import FullPinterestVideoCardController from '../full//FullPinterestVideoCardController.js';

export default class LightboxPlaylistPlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightboxPlaylistPlayerView());

        this.CardControllers = {
            article: LightboxPlaylistArticleCardController,
            text: LightboxPlaylistTextCardController,
            image: LightboxPlaylistImageCardController,
            video: LightboxPlaylistVideoCardController,
            recap: LightboxPlaylistRecapCardController,
            preroll: LightboxPlaylistPrerollCardController,
            displayAd: DisplayAdCardController,
            pinterestImage: FullPinterestImageCardController,
            pinterestVideo: FullPinterestVideoCardController
        };

        this.initPlaylist();
        this.initFullscreen();
    }
}
LightboxPlaylistPlayerController.mixin(PlaylistPlayerController, FullscreenPlayerController); // jshint ignore:line
