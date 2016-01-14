import PlayerController from '../PlayerController.js';
import LightboxPlayerView from '../../views/lightbox/LightboxPlayerView.js';

/***************************************************************************************************
 * CARD CONTROLLER IMPORTS
 **************************************************************************************************/
import LightboxVideoCardController from './LightboxVideoCardController.js';

/* #if card.types.indexOf('image') > -1 */
import LightboxImageCardController from './LightboxImageCardController.js';
/* #endif */

/* #if card.types.indexOf('instagram') > -1 */
import FullNPInstagramImageCardController from '../full-np/FullNPInstagramImageCardController.js';
import FullNPInstagramVideoCardController from '../full-np/FullNPInstagramVideoCardController.js';
/* #endif */

/* #if card.types.indexOf('recap') > -1 */
import LightboxRecapCardController from './LightboxRecapCardController.js';
/* #endif */

/***************************************************************************************************
 * MIXIN IMPORTS
 **************************************************************************************************/
import FullscreenPlayerController from '../../mixins/FullscreenPlayerController.js';

/* #if isMiniReel */
import ThumbnailNavigatorPlayerController from '../../mixins/ThumbnailNavigatorPlayerController.js';
/* #endif */

export default class LightboxPlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightboxPlayerView());

        this.CardControllers = {
            video: LightboxVideoCardController,

            /* #if card.types.indexOf('image') > -1 */
            image: LightboxImageCardController,
            /* #endif */

            /* #if card.types.indexOf('instagram') > -1 */
            instagramImage: FullNPInstagramImageCardController,
            instagramVideo: FullNPInstagramVideoCardController,
            /* #endif */

            /* #if card.types.indexOf('recap') > -1 */
            recap: LightboxRecapCardController,
            /* #endif */
        };

        this.initFullscreen();

        /* #if isMiniReel */
        this.initThumbnailNavigator();
        /* #endif */
    }
}
LightboxPlayerController.mixin(// jshint ignore:line
    /* #if isMiniReel */
    ThumbnailNavigatorPlayerController,
    /* #endif */
    FullscreenPlayerController

);
