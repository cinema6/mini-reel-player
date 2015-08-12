import PlayerController from '../PlayerController.js';
import MobilePlayerView from '../../views/mobile/MobilePlayerView.js';
import TableOfContentsViewController from './TableOfContentsViewController.js';
import MobileArticleCardController from './MobileArticleCardController.js';
import MobileTextCardController from './MobileTextCardController.js';
import MobileImageCardController from './MobileImageCardController.js';
import MobileVideoCardController from './MobileVideoCardController.js';
import MobileRecapCardController from './MobileRecapCardController.js';
import MobilePrerollCardController from './MobilePrerollCardController.js';
import DisplayAdCardController from '../DisplayAdCardController.js';
import MobileInstagramImageCardController from './MobileInstagramImageCardController.js';
import MobileInstagramVideoCardController from './MobileInstagramVideoCardController.js';
import FullscreenPlayerController from '../../mixins/FullscreenPlayerController.js';

export default class MobilePlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobilePlayerView());
        this.TableOfContentsViewCtrl = new TableOfContentsViewController(this.minireel);
        this.CardControllers = {
            article: MobileArticleCardController,
            text: MobileTextCardController,
            image: MobileImageCardController,
            video: MobileVideoCardController,
            recap: MobileRecapCardController,
            preroll: MobilePrerollCardController,
            displayAd: DisplayAdCardController,
            instagramImage: MobileInstagramImageCardController,
            instagramVideo: MobileInstagramVideoCardController
        };

        this.minireel.on('init', () => this.TableOfContentsViewCtrl.renderInto(this.view.toc));
        this.minireel.on('becameUnskippable', () => this.updateView());
        this.minireel.on('becameSkippable', () => this.updateView());

        this.TableOfContentsViewCtrl.on('show', () => this.view.hideChrome());
        this.TableOfContentsViewCtrl.on('hide', () => this.view.showChrome());

        this.initFullscreen();
    }

    updateView() {
        const {minireel} = this;
        const { standalone, currentIndex, length, skippable, closeable } = minireel;
        const nextCard = minireel.deck[minireel.currentIndex + 1];
        const prevCard = minireel.deck[minireel.currentIndex - 1];
        const isSolo = (minireel.length === 1);

        super();

        this.view.update({
            closeable: !standalone && closeable,
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
