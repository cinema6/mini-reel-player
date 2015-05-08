import PlayerController from '../PlayerController.js';
import MobilePlayerView from '../../views/mobile/MobilePlayerView.js';
import TableOfContentsViewController from './TableOfContentsViewController.js';
import MobileTextCardController from './MobileTextCardController.js';
import MobileVideoCardController from './MobileVideoCardController.js';
import MobileRecapCardController from './MobileRecapCardController.js';
import MobilePrerollCardController from './MobilePrerollCardController.js';
import DisplayAdCardController from '../DisplayAdCardController.js';
import FullscreenPlayerController from '../../mixins/FullscreenPlayerController.js';

export default class MobilePlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobilePlayerView());
        this.TableOfContentsViewCtrl = new TableOfContentsViewController(this.minireel);
        this.CardControllers = {
            text: MobileTextCardController,
            video: MobileVideoCardController,
            recap: MobileRecapCardController,
            preroll: MobilePrerollCardController,
            displayAd: DisplayAdCardController
        };

        this.minireel.on('init', () => this.TableOfContentsViewCtrl.renderInto(this.view.toc));

        this.TableOfContentsViewCtrl.on('show', () => this.view.hideChrome());
        this.TableOfContentsViewCtrl.on('hide', () => this.view.showChrome());

        this.initFullscreen();
    }

    updateView() {
        const {minireel} = this;
        const nextCard = minireel.deck[minireel.currentIndex + 1];
        const prevCard = minireel.deck[minireel.currentIndex - 1];
        const { standalone, currentIndex, length } = minireel;

        this.view.update({
            closeable: !standalone,
            header: (currentIndex !== null) ? `${currentIndex + 1} of ${length}` : 'Ad',
            thumbs: {
                next: (nextCard && nextCard.thumbs.small) || null,
                previous: (prevCard && prevCard.thumbs.small) || null
            }
        });

        return super();
    }

    toggleToc() {
        this.TableOfContentsViewCtrl.toggle();
    }
}
MobilePlayerController.mixin(FullscreenPlayerController); // jshint ignore:line
