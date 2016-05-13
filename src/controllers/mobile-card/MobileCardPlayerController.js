import CardPlayerController from '../CardPlayerController.js';
import MobileCardPlayerView from '../../views/mobile-card/MobileCardPlayerView.js';

/***************************************************************************************************
 * CARD CONTROLLER IMPORTS
 **************************************************************************************************/
import MobileCardVideoCardController from './MobileCardVideoCardController.js';

/* #if card.types.indexOf('instagram') > -1 */
import MobileInstagramImageCardController from '../mobile/MobileInstagramImageCardController.js';
import MobileInstagramVideoCardController from '../mobile/MobileInstagramVideoCardController.js';
/* #endif */

/* #if card.types.indexOf('showcase-app') > -1 */
import MobileCardShowcaseAppCardController from './MobileCardShowcaseAppCardController.js';
/* #endif */

export default class MobileCardPlayerController extends CardPlayerController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobileCardPlayerView());

        this.CardControllers = {
            video: MobileCardVideoCardController,

            /* #if card.types.indexOf('instagram') > -1 */
            instagramImage: MobileInstagramImageCardController,
            instagramVideo: MobileInstagramVideoCardController,
            /* #endif */

            /* #if card.types.indexOf('showcase-app') > -1 */
            'showcase-app': MobileCardShowcaseAppCardController,
            /* #endif */
        };
    }
}
