import PlayerController from '../PlayerController.js';
import FullNPPlayerView from '../../views/full-np/FullNPPlayerView.js';

/***************************************************************************************************
 * CARD CONTROLLER IMPORTS
 **************************************************************************************************/
import FullNPVideoCardController from './FullNPVideoCardController.js';

/* #if card.types.indexOf('image') > -1 */
import FullNPImageCardController from './FullNPImageCardController.js';
/* #endif */

/* #if card.types.indexOf('instagram') > -1 */
import FullNPInstagramImageCardController from './FullNPInstagramImageCardController.js';
import FullNPInstagramVideoCardController from './FullNPInstagramVideoCardController.js';
/* #endif */

/* #if card.types.indexOf('recap') > -1 */
import FullNPRecapCardController from './FullNPRecapCardController.js';
/* #endif */

/***************************************************************************************************
 * MIXIN IMPORTS
 **************************************************************************************************/
/* #if isMiniReel */
import ThumbnailNavigatorPlayerController from '../../mixins/ThumbnailNavigatorPlayerController.js';
/* #endif */

export default class FullNPPlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullNPPlayerView());

        this.CardControllers = {
            video: FullNPVideoCardController,

            /* #if card.types.indexOf('image') > -1 */
            image: FullNPImageCardController,
            /* #endif */

            /* #if card.types.indexOf('instagram') > -1 */
            instagramImage: FullNPInstagramImageCardController,
            instagramVideo: FullNPInstagramVideoCardController,
            /* #endif */

            /* #if card.types.indexOf('recap') > -1 */
            recap: FullNPRecapCardController,
            /* #endif */
        };

        /* #if isMiniReel */
        this.initThumbnailNavigator();
        /* #endif */
    }

    updateView() {
        this.view.update({ splash: this.minireel.splash });
        return super.updateView(...arguments);
    }
}
/* #if isMiniReel */
FullNPPlayerController.mixin(ThumbnailNavigatorPlayerController); // jshint ignore:line
/* #endif */
