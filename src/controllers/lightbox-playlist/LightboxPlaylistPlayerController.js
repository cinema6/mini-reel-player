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
import FullTwitterTextCardController from '../full/FullTwitterTextCardController.js';
import FullTwitterImageCardController from '../full/FullTwitterImageCardController.js';
import FullTwitterGifCardController from '../full/FullTwitterGifCardController.js';
import FullTwitterVideoCardController from '../full/FullTwitterVideoCardController.js';
import PlaylistPlayerController from '../../mixins/PlaylistPlayerController.js';
import FullscreenPlayerController from '../../mixins/FullscreenPlayerController.js';

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
            twitterText: FullTwitterTextCardController,
            twitterImage: FullTwitterImageCardController,
            twitterGif: FullTwitterGifCardController,
            twitterVideo: FullTwitterVideoCardController
        };

        this.initPlaylist();
        this.initFullscreen();
    }
}
LightboxPlaylistPlayerController.mixin(PlaylistPlayerController, FullscreenPlayerController); // jshint ignore:line
