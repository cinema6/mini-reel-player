import Controller from '../../lib/core/Controller.js';
import MiniReel from '../models/MiniReel.js';
import Runner from '../../lib/Runner.js';
import {createKey} from 'private-parts';
import {
    map,
    forEach
} from '../../lib/utils.js';

const _ = createKey();

export default class PlayerController extends Controller {
    constructor(parentView) {
        super(...arguments);

        _(this).parentView = parentView;

        this.CardControllers = {};

        this.minireel = new MiniReel();
        this.cardCtrls = [];
        this.PrerollCardCtrl = null;

        this.minireel.on('init', () => {
            this.updateView();

            const openEvent = () => this.openedModal();
            const closeEvent = () => this.closedModal();
            this.cardCtrls = map(this.minireel.deck, card => {
                const ctrl = new this.CardControllers[card.type](card, this.view.cards);
                ctrl.on('openedModal', openEvent);
                ctrl.on('closedModal', closeEvent);
                return ctrl;
            });
            this.PrerollCardCtrl = new this.CardControllers.preroll(this.minireel.prerollCard);

            forEach(this.cardCtrls.slice(0, 1), Ctrl => Ctrl.render());
            this.PrerollCardCtrl.renderInto(this.view.prerollOutlet);

            this.view.appendTo(_(this).parentView);
        });
        this.minireel.on('move', () => this.updateView());
        this.minireel.on('becameUncloseable', () => this.updateView());
        this.minireel.on('becameCloseable', () => this.updateView());
        this.minireel.once('launch', () => {
            Runner.runNext(() => forEach(this.cardCtrls.slice(1), Ctrl => Ctrl.render()));
        });
        this.minireel.on('becameUnskippable', () => this.view.disableNavigation());
        this.minireel.on('becameSkippable', () => this.view.enableNavigation());
        this.minireel.on('skippableProgress', remaining => this.view.updateSkipTimer(remaining));
    }

    openedModal() {
    }

    closedModal() {
    }

    addListeners() {
    }

    next() {
        this.minireel.next();
    }

    previous() {
        this.minireel.previous();
    }

    close() {
        this.minireel.close();
    }

    updateView() {
        const { minireel } = this;
        const { currentIndex, currentCard, standalone, closeable, length } = minireel;
        const socialLinks = minireel.get('socialLinks') || [];

        this.view.update({
            title: minireel.get('title'),
            sponsor: minireel.get('sponsor'),
            logo: minireel.get('logo'),
            links: socialLinks,
            website: minireel.get('links.Website.uri'),
            isSponsored: !!(
                minireel.get('sponsor') ||
                minireel.get('logo') ||
                socialLinks.length > 0
            ),
            hasLinks: !!(minireel.get('links.Website') || socialLinks.length > 0),
            totalCards: minireel.get('length'),
            isSolo: minireel.get('length') === 1,

            closeable: closeable,
            cardType: currentCard && currentCard.type,
            currentCardNumber: (currentIndex + 1).toString(),
            canGoForward: currentIndex < (length - 1),
            canGoBack: currentIndex === null || !standalone || currentIndex > 0
        });

        if (minireel.currentCard !== minireel.prerollCard) {
            this.view.cards.show();
            this.view.prerollOutlet.hide();
        } else {
            this.view.cards.hide();
            this.view.prerollOutlet.show();
        }
    }
}
