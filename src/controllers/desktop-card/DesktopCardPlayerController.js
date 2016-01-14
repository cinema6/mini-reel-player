import CardPlayerController from '../CardPlayerController.js';
import DesktopCardPlayerView from '../../views/desktop-card/DesktopCardPlayerView.js';

/***************************************************************************************************
 * CARD CONTROLLER IMPORTS
 **************************************************************************************************/
import DesktopCardVideoCardController from './DesktopCardVideoCardController.js';

/* #if card.types.indexOf('instagram') > -1 */
import LightInstagramImageCardController from '../light/LightInstagramImageCardController.js';
import LightInstagramVideoCardController from '../light/LightInstagramVideoCardController.js';
/* #endif */

export default class DesktopCardPlayerController extends CardPlayerController {
    constructor(rootView) {
        super(rootView);

        this.CardControllers = {
            video: DesktopCardVideoCardController,

            /* #if card.types.indexOf('instagram') > -1 */
            instagramImage: LightInstagramImageCardController,
            instagramVideo: LightInstagramVideoCardController,
            /* #endif */
        };

        this.view = this.addView(new DesktopCardPlayerView());
    }
}
