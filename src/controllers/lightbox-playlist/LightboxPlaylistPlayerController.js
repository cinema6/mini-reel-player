import PlayerController from '../PlayerController.js';
import LightboxPlaylistPlayerView
    from '../../views/lightbox-playlist/LightboxPlaylistPlayerView.js';
import LightboxPlaylistTextCardController from './LightboxPlaylistTextCardController.js';
import LightboxPlaylistVideoCardController from './LightboxPlaylistVideoCardController.js';
import LightboxPlaylistRecapCardController from './LightboxPlaylistRecapCardController.js';
import PlaylistPlayerController from '../../mixins/PlaylistPlayerController.js';
import FullscreenPlayerController from '../../mixins/FullscreenPlayerController.js';

export default class LightboxPlaylistPlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightboxPlaylistPlayerView());

        this.CardControllers = {
            text: LightboxPlaylistTextCardController,
            video: LightboxPlaylistVideoCardController,
            recap: LightboxPlaylistRecapCardController
        };

        this.initPlaylist();
        this.initFullscreen();
    }

    updateView() {
        const { minireel: { currentCard } } = this;

        this.view.update({
            cardType: currentCard && currentCard.type
        });
        return super(...arguments);
    }
}
LightboxPlaylistPlayerController.mixin(PlaylistPlayerController, FullscreenPlayerController); // jshint ignore:line
