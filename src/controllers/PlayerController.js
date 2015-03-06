import Controller from '../../lib/core/Controller.js';
import PlayerView from '../views/PlayerView.js';
import MiniReel from '../models/MiniReel.js';
import TextCardController from './TextCardController.js';
import VideoCardController from './VideoCardController.js';
import RecapCardController from './RecapCardController.js';
import TableOfContentsViewController from './TableOfContentsViewController.js';
import cinema6 from '../services/cinema6.js';
import Runner from '../../lib/Runner.js';
import {
    map,
    forEach
} from '../../lib/utils.js';

const CardControllers = {
    text: TextCardController,
    video: VideoCardController,
    recap: RecapCardController
};

export default class PlayerController extends Controller {
    constructor(parentView) {
        super(...arguments);

        this.session = cinema6.init();
        this.view = new PlayerView();
        this.minireel = new MiniReel();
        this.cardCtrls = [];
        this.TableOfContentsViewCtrl = new TableOfContentsViewController(this.minireel);

        this.minireel.on('init', () => {
            this.updateView();

            this.cardCtrls = map(this.minireel.deck, card => {
                return new CardControllers[card.type](card, this.view.cards);
            });
            forEach(this.cardCtrls.slice(0, 1), Ctrl => Ctrl.render());

            this.TableOfContentsViewCtrl.renderInto(this.view.toc);
            this.view.appendTo(parentView);
        });
        this.minireel.on('move', () => this.updateView());
        this.minireel.on('launch', () => cinema6.fullscreen(true));
        this.minireel.once('launch', () => {
            Runner.runNext(() => forEach(this.cardCtrls.slice(1), Ctrl => Ctrl.render()));
        });
        this.minireel.on('close', () => cinema6.fullscreen(false));

        this.view.on('next', () => this.minireel.next());
        this.view.on('previous', () => this.minireel.previous());
        this.view.on('close', () => this.minireel.close());
        this.view.on('toggleToc', () => this.TableOfContentsViewCtrl.toggle());

        this.TableOfContentsViewCtrl.on('show', () => this.view.hideNavigation());
        this.TableOfContentsViewCtrl.on('hide', () => this.view.showNavigation());
    }

    updateView() {
        const {minireel} = this;
        const nextCard = minireel.deck[minireel.currentIndex + 1];
        const prevCard = minireel.deck[minireel.currentIndex - 1];

        this.view.update({
            title: minireel.title,
            totalCards: minireel.length,
            currentCardNumber: (minireel.currentIndex + 1).toString(),
            canGoForward: minireel.currentIndex < (minireel.length - 1),
            canGoBack: minireel.currentIndex > -1,
            thumbs: {
                next: (nextCard && nextCard.thumbs.small) || null,
                previous: (prevCard && prevCard.thumbs.small) || null
            }
        });
    }
}
