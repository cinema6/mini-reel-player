import PlayerController from '../PlayerController.js';
import MobilePlayerView from '../../views/mobile/MobilePlayerView.js';
import FullscreenPlayerController from '../../mixins/FullscreenPlayerController.js';

/***************************************************************************************************
 * CARD CONTROLLER IMPORTS
 **************************************************************************************************/
import MobileVideoCardController from './MobileVideoCardController.js';

/* #if card.types.indexOf('image') > -1 */
import MobileImageCardController from './MobileImageCardController.js';
/* #endif */

/* #if card.types.indexOf('instagram') > -1 */
import MobileInstagramImageCardController from './MobileInstagramImageCardController.js';
import MobileInstagramVideoCardController from './MobileInstagramVideoCardController.js';
/* #endif */

/* #if card.types.indexOf('recap') > -1 */
import MobileRecapCardController from './MobileRecapCardController.js';
/* #endif */

/***************************************************************************************************
 * UI IMPORTS
 **************************************************************************************************/
/* #if isMiniReel */
import TableOfContentsViewController from './TableOfContentsViewController.js';
/* #endif */

export default class MobilePlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobilePlayerView());
        this.CardControllers = {
            video: MobileVideoCardController,

            /* #if card.types.indexOf('image') > -1 */
            image: MobileImageCardController,
            /* #endif */

            /* #if card.types.indexOf('instagram') > -1 */
            instagramImage: MobileInstagramImageCardController,
            instagramVideo: MobileInstagramVideoCardController,
            /* #endif */

            /* #if card.types.indexOf('recap') > -1 */
            recap: MobileRecapCardController,
            /* #endif */
        };

        this.minireel.on('becameUnskippable', () => this.updateView());
        this.minireel.on('becameSkippable', () => this.updateView());

        /* #if isMiniReel */
        this.TableOfContentsViewCtrl = new TableOfContentsViewController(this.minireel);
        this.minireel.on('init', () => this.TableOfContentsViewCtrl.renderInto(this.view.toc));
        this.TableOfContentsViewCtrl.on('show', () => this.view.hideChrome());
        this.TableOfContentsViewCtrl.on('hide', () => this.view.showChrome());
        /* #endif */

        this.initFullscreen();
    }

    openedModal() {
        super.openedModal(...arguments);
        this.view.singleCloseButton.hide();
    }

    closedModal() {
        super.closedModal(...arguments);
        this.view.singleCloseButton.show();
    }

    updateView() {
        const {minireel} = this;
        const { currentIndex, length, skippable } = minireel;
        const nextCard = minireel.deck[minireel.currentIndex + 1];
        const prevCard = minireel.deck[minireel.currentIndex - 1];
        const isSolo = (minireel.length === 1);

        super.updateView();

        this.view.update({
            showFooter: !isSolo || !skippable,
            header: (currentIndex !== null) ? `${currentIndex + 1} of ${length}` : 'Ad',
            thumbs: {
                next: (nextCard && nextCard.thumbs.small) || null,
                previous: (prevCard && prevCard.thumbs.small) || null
            }
        });
    }

    toggleToc() {
        this.TableOfContentsViewCtrl.toggle();
    }
}
MobilePlayerController.mixin(FullscreenPlayerController); // jshint ignore:line
