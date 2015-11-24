import PlayerController from '../PlayerController.js';
import FullNPPlayerView from '../../views/full-np/FullNPPlayerView.js';
import FullNPArticleCardController from './FullNPArticleCardController.js';
import FullNPTextCardController from './FullNPTextCardController.js';
import FullNPImageCardController from './FullNPImageCardController.js';
import FullNPVideoCardController from './FullNPVideoCardController.js';
import FullNPRecapCardController from './FullNPRecapCardController.js';
import LightboxPrerollCardController from '../lightbox/LightboxPrerollCardController.js';
import DisplayAdCardController from '../DisplayAdCardController.js';
import FullNPInstagramImageCardController from './FullNPInstagramImageCardController.js';
import FullNPInstagramVideoCardController from './FullNPInstagramVideoCardController.js';
import ThumbnailNavigatorPlayerController from '../../mixins/ThumbnailNavigatorPlayerController.js';

export default class FullNPPlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullNPPlayerView());

        this.CardControllers = {
            article: FullNPArticleCardController,
            text: FullNPTextCardController,
            image: FullNPImageCardController,
            video: FullNPVideoCardController,
            recap: FullNPRecapCardController,
            preroll: LightboxPrerollCardController,
            displayAd: DisplayAdCardController,
            instagramImage: FullNPInstagramImageCardController,
            instagramVideo: FullNPInstagramVideoCardController
        };

        this.initThumbnailNavigator();
    }

    updateView() {
        this.view.update({ splash: this.minireel.splash });
        return super.updateView(...arguments);
    }
}
FullNPPlayerController.mixin(ThumbnailNavigatorPlayerController); // jshint ignore:line
