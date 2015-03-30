import PlayerController from '../PlayerController.js';
import MobilePlayerView from '../../views/mobile/MobilePlayerView.js';
import TableOfContentsViewController from './TableOfContentsViewController.js';
import cinema6 from '../../services/cinema6.js';
import MobileTextCardController from './MobileTextCardController.js';
import MobileVideoCardController from './MobileVideoCardController.js';
import MobileRecapCardController from './MobileRecapCardController.js';

export default class MobilePlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.view = new MobilePlayerView();
        this.TableOfContentsViewCtrl = new TableOfContentsViewController(this.minireel);
        this.CardControllers = {
            text: MobileTextCardController,
            video: MobileVideoCardController,
            recap: MobileRecapCardController
        };

        this.addListeners();
    }

    addListeners() {
        super(...arguments);

        this.minireel.on('init', () => this.TableOfContentsViewCtrl.renderInto(this.view.toc));
        this.minireel.on('launch', () => cinema6.fullscreen(true));
        this.minireel.on('close', () => cinema6.fullscreen(false));

        this.view.on('toggleToc', () => this.TableOfContentsViewCtrl.toggle());

        this.TableOfContentsViewCtrl.on('show', () => this.view.hideChrome());
        this.TableOfContentsViewCtrl.on('hide', () => this.view.showChrome());
    }

    updateView() {
        const {minireel} = this;
        const nextCard = minireel.deck[minireel.currentIndex + 1];
        const prevCard = minireel.deck[minireel.currentIndex - 1];
        const { standalone } = minireel;

        this.view.update({
            closeable: !standalone,
            thumbs: {
                next: (nextCard && nextCard.thumbs.small) || null,
                previous: (prevCard && prevCard.thumbs.small) || null
            }
        });

        return super();
    }
}
