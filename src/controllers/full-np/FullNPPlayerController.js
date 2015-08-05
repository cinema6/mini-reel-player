import PlayerController from '../PlayerController.js';
import FullNPPlayerView from '../../views/full-np/FullNPPlayerView.js';
import FullArticleCardController from '../full/FullArticleCardController.js';
import FullTextCardController from '../full/FullTextCardController.js';
import FullImageCardController from '../full/FullImageCardController.js';
import FullVideoCardController from '../full/FullVideoCardController.js';
import FullRecapCardController from '../full/FullRecapCardController.js';
import LightboxPrerollCardController from '../lightbox/LightboxPrerollCardController.js';
import DisplayAdCardController from '../DisplayAdCardController.js';
import FullTwitterTextCardController from '../full/FullTwitterTextCardController.js';
import FullTwitterImageCardController from '../full/FullTwitterImageCardController.js';
import FullTwitterGifCardController from '../full/FullTwitterGifCardController.js';
import FullTwitterVideoCardController from '../full/FullTwitterVideoCardController.js';
import ThumbnailNavigatorPlayerController from '../../mixins/ThumbnailNavigatorPlayerController.js';

export default class FullPlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullNPPlayerView());

        this.CardControllers = {
            article: FullArticleCardController,
            text: FullTextCardController,
            image: FullImageCardController,
            video: FullVideoCardController,
            recap: FullRecapCardController,
            preroll: LightboxPrerollCardController,
            displayAd: DisplayAdCardController,
            twitterText: FullTwitterTextCardController,
            twitterImage: FullTwitterImageCardController,
            twitterGif: FullTwitterGifCardController,
            twitterVideo: FullTwitterVideoCardController
        };

        this.initThumbnailNavigator();
    }

    updateView() {
        this.view.update({ splash: this.minireel.splash });
        return super(...arguments);
    }
}
FullPlayerController.mixin(ThumbnailNavigatorPlayerController); // jshint ignore:line
