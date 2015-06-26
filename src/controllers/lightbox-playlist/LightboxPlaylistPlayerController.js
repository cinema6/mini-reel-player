import PlayerController from '../PlayerController.js';
import LightboxPlaylistPlayerView
    from '../../views/lightbox-playlist/LightboxPlaylistPlayerView.js';
import LightboxPlaylistTextCardController from './LightboxPlaylistTextCardController.js';
import LightboxPlaylistImageCardController from './LightboxPlaylistImageCardController.js';
import LightboxPlaylistVideoCardController from './LightboxPlaylistVideoCardController.js';
import LightboxPlaylistRecapCardController from './LightboxPlaylistRecapCardController.js';
import LightboxPlaylistPrerollCardController from './LightboxPlaylistPrerollCardController.js';
import DisplayAdCardController from '../DisplayAdCardController.js';
import PlaylistPlayerController from '../../mixins/PlaylistPlayerController.js';
import FullscreenPlayerController from '../../mixins/FullscreenPlayerController.js';

export default class LightboxPlaylistPlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightboxPlaylistPlayerView());

        this.CardControllers = {
            text: LightboxPlaylistTextCardController,
            image: LightboxPlaylistImageCardController,
            video: LightboxPlaylistVideoCardController,
            recap: LightboxPlaylistRecapCardController,
            preroll: LightboxPlaylistPrerollCardController,
            displayAd: DisplayAdCardController
        };

        this.initPlaylist();
        this.initFullscreen();
    }
}
LightboxPlaylistPlayerController.mixin(PlaylistPlayerController, FullscreenPlayerController); // jshint ignore:line
