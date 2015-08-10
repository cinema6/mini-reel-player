import PlayerController from '../PlayerController.js';
import LightPlayerView from '../../views/light/LightPlayerView.js';
import ThumbnailNavigatorPlayerController from '../../mixins/ThumbnailNavigatorPlayerController.js';
import LightArticleCardController from './LightArticleCardController.js';
import LightTextCardController from './LightTextCardController.js';
import LightImageCardController from './LightImageCardController.js';
import LightVideoCardController from './LightVideoCardController.js';
import LightboxPlaylistRecapCardController
    from '../lightbox-playlist/LightboxPlaylistRecapCardController.js';
import LightPrerollCardController from './LightPrerollCardController.js';
import DisplayAdCardController from '../DisplayAdCardController.js';
import LightPinterestImageCardController from './LightPinterestImageCardController.js';
import LightPinterestVideoCardController from './LightPinterestVideoCardController.js';

export default class LightPlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightPlayerView());
        this.CardControllers = {
            article: LightArticleCardController,
            text: LightTextCardController,
            image: LightImageCardController,
            video: LightVideoCardController,
            recap: LightboxPlaylistRecapCardController,
            preroll: LightPrerollCardController,
            displayAd: DisplayAdCardController,
            pinterestImage: LightPinterestImageCardController,
            pinterestVideo: LightPinterestVideoCardController
        };

        this.session.once('ready', () => {
            this.session.ping('responsiveStyles', {
                minWidth: '18.75em',
                padding: '0 0 85% 0',
                fontSize: '16px',
                height: '0px',
                overflow: 'hidden'
            });
        });

        this.initThumbnailNavigator();
    }
}
LightPlayerController.mixin(ThumbnailNavigatorPlayerController); // jshint ignore:line
