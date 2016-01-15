import PlayerController from '../PlayerController.js';
import LightPlayerView from '../../views/light/LightPlayerView.js';

/***************************************************************************************************
 * CARD CONTROLLER IMPORTS
 **************************************************************************************************/
import LightVideoCardController from './LightVideoCardController.js';

/* #if card.types.indexOf('image') > -1 */
import LightImageCardController from './LightImageCardController.js';
/* #endif */

/* #if card.types.indexOf('instagram') > -1 */
import LightInstagramImageCardController from './LightInstagramImageCardController.js';
import LightInstagramVideoCardController from './LightInstagramVideoCardController.js';
/* #endif */

/* #if card.types.indexOf('recap') > -1 */
import LightboxRecapCardController from '../lightbox/LightboxRecapCardController.js';
/* #endif */

/***************************************************************************************************
 * MIXIN IMPORTS
 **************************************************************************************************/
/* #if isMiniReel */
import ThumbnailNavigatorPlayerController from '../../mixins/ThumbnailNavigatorPlayerController.js';
/* #endif */

export default class LightPlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightPlayerView());
        this.CardControllers = {
            video: LightVideoCardController,

            /* #if card.types.indexOf('image') > -1 */
            image: LightImageCardController,
            /* #endif */

            /* #if card.types.indexOf('instagram') > -1 */
            instagramImage: LightInstagramImageCardController,
            instagramVideo: LightInstagramVideoCardController,
            /* #endif */

            /* #if card.types.indexOf('recap') > -1 */
            recap: LightboxRecapCardController,
            /* #endif */
        };

        this.minireel.embed.setStyles({
            minWidth: '18.75em',
            padding: '0 0 85% 0',
            fontSize: '16px',
            height: '0px',
            overflow: 'hidden'
        });

        /* #if isMiniReel */
        this.initThumbnailNavigator();
        /* #endif */
    }
}
/* #if isMiniReel */
LightPlayerController.mixin(ThumbnailNavigatorPlayerController); // jshint ignore:line
/* #endif */
