import Controller from '../../lib/core/Controller.js';
import MiniReel from '../models/MiniReel.js';
import cinema6 from '../services/cinema6.js';
import Runner from '../../lib/Runner.js';
import {createKey} from 'private-parts';
import environment from '../environment.js';
import codeLoader from '../services/code_loader.js';
import browser from '../services/browser.js';
import {
    map,
    forEach
} from '../../lib/utils.js';

function loadBranding(minireel) {
    const { apiRoot, mode } = environment;
    const { branding } = minireel;

    if (!branding) { return; }

    const base = `${apiRoot}/collateral/branding/${branding}/styles`;

    codeLoader.loadStyles(`${base}/${mode}/theme.css`);
    codeLoader.loadStyles(`${base}/core.css`);

    browser.test('mouse').then(hasMouse => {
        if (hasMouse) {
            codeLoader.loadStyles(`${base}/${mode}/theme--hover.css`);
            codeLoader.loadStyles(`${base}/core--hover.css`);
        }
    });
}

const _ = createKey();

export default class PlayerController extends Controller {
    constructor(parentView) {
        super(...arguments);

        _(this).parentView = parentView;

        this.CardControllers = {};

        this.session = cinema6.init();
        this.minireel = new MiniReel();
        this.cardCtrls = [];
        this.PrerollCardCtrl = null;

        this.minireel.on('init', () => {
            this.updateView();

            this.cardCtrls = map(this.minireel.deck, card => {
                return new this.CardControllers[card.type](card, this.view.cards);
            });
            this.PrerollCardCtrl = new this.CardControllers.preroll(this.minireel.prerollCard);

            forEach(this.cardCtrls.slice(0, 1), Ctrl => Ctrl.render());
            this.PrerollCardCtrl.renderInto(this.view.prerollOutlet);

            this.view.appendTo(_(this).parentView);

            loadBranding(this.minireel);
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
        const { currentIndex, currentCard, standalone } = minireel;
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
            isSolo: minireel.length === 1,

            cardType: currentCard && currentCard.type,
            currentCardNumber: (minireel.currentIndex + 1).toString(),
            canGoForward: currentIndex < (minireel.length - 1),
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
