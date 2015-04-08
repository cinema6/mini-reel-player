import Controller from '../../lib/core/Controller.js';
import MiniReel from '../models/MiniReel.js';
import cinema6 from '../services/cinema6.js';
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

        this.session = cinema6.init();
        this.minireel = new MiniReel();
        this.cardCtrls = [];

        this.minireel.on('init', () => {
            this.updateView();

            this.cardCtrls = map(this.minireel.deck, card => {
                return new this.CardControllers[card.type](card, this.view.cards);
            });
            forEach(this.cardCtrls.slice(0, 1), Ctrl => Ctrl.render());

            this.view.appendTo(_(this).parentView);
        });
        this.minireel.on('move', () => this.updateView());
        this.minireel.once('launch', () => {
            Runner.runNext(() => forEach(this.cardCtrls.slice(1), Ctrl => Ctrl.render()));
        });
        this.minireel.on('becameUnskippable', () => this.view.disableNavigation());
        this.minireel.on('becameSkippable', () => this.view.enableNavigation());
        this.minireel.on('skippableProgress', remaining => this.view.updateSkipTimer(remaining));
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
        const { currentIndex, standalone } = minireel;
        const socialLinks = minireel.socialLinks || [];
        const links = minireel.links || {};

        this.view.update({
            title: minireel.title,
            sponsor: minireel.sponsor,
            logo: minireel.logo,
            links: socialLinks,
            website: links.Website,
            isSponsored: !!(
                minireel.sponsor ||
                minireel.logo ||
                socialLinks.length > 0
            ),
            hasLinks: !!(links.Website || socialLinks.length > 0),
            totalCards: minireel.length,

            currentCardNumber: (minireel.currentIndex + 1).toString(),
            canGoForward: currentIndex < (minireel.length - 1),
            canGoBack: (currentIndex > 0 || !standalone) && currentIndex > -1
        });
    }
}
