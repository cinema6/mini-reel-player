import Controller from '../../../lib/core/Controller.js';
import SwipePlayerView from '../../views/swipe/SwipePlayerView.js';
import SwipeVideoCardController from './SwipeVideoCardController.js';
import SwipeTextCardController from './SwipeTextCardController.js';
import SwipePrerollCardController from './SwipePrerollCardController.js';
import InfoPanelController from './InfoPanelController.js';
import cinema6 from '../../services/cinema6.js';
import MiniReel from '../../models/MiniReel.js';
import { createKey } from 'private-parts';
import Runner from '../../../lib/Runner.js';
import {
    map,
    forEach,
    find
} from '../../../lib/utils.js';

const _ = createKey();

export default class SwipePlayerController extends Controller {
    constructor(parentView) {
        super(...arguments);

        const updateView = (() => this.updateView());

        _(this).parentView = parentView;

        this.session = cinema6.init();
        this.model = new MiniReel(['text', 'video']);
        this.view = this.addView(new SwipePlayerView());

        this.CardCtrls = [];
        this.PrerollCardCtrl = null;
        this.InfoPanelCtrl = null;

        this.CardControllers = {
            video: SwipeVideoCardController,
            text: SwipeTextCardController,
            preroll: SwipePrerollCardController
        };

        this.showInfo = false;

        this.model.once('init', () => {
            const totalCards = this.model.deck.length;

            this.render();

            this.CardCtrls = map(this.model.deck, (card, index) => {
                return new this.CardControllers[card.type](card, {
                    number: index + 1,
                    total: totalCards
                }, this.view.cards);
            });
            this.PrerollCardCtrl = new this.CardControllers.preroll(this.model.prerollCard);
            this.InfoPanelCtrl = new InfoPanelController(this.model);

            forEach(this.CardCtrls.slice(0, 2), Ctrl => Ctrl.render());
            this.PrerollCardCtrl.renderInto(this.view.prerollOutlet);
            this.InfoPanelCtrl.renderInto(this.view.infoOutlet);

            this.InfoPanelCtrl.on('activate', () => this.showInfo = true);
            this.InfoPanelCtrl.on('deactivate', () => this.showInfo = false);
        });
        this.model.once('launch', () => {
            Runner.runNext(() => {
                forEach(this.CardCtrls.slice(2), Ctrl => Ctrl.render());
                this.view.cards.refresh();
            });
        });
        this.model.on('move', updateView);
        this.model.on('becameUnskippable', updateView);
        this.model.on('becameSkippable', updateView);
        this.model.on('skippableProgress', remaining => this.view.skipTimer.update(remaining));
    }

    render() {
        this.view.update({
            title: this.model.title,
            standalone: this.model.standalone
        });
        this.view.cards.delegate = this;

        this.view.cards.on('swipe', () => this.model.moveToIndex(this.view.cards.currentIndex));
        this.view.cards.on('animationEnd', () => this.updateView());

        this.view.appendTo(_(this).parentView);
    }

    updateView() {
        const { showInfo, model: { currentIndex, currentCard, skippable, prerollCard } } = this;
        const CardCtrl = this.CardCtrls[currentIndex];
        const locked = !skippable && currentCard !== prerollCard;
        const flippable = CardCtrl && CardCtrl.flippable;

        this.InfoPanelCtrl.activate(showInfo);

        if (Number(currentIndex) === currentIndex) {
            this.view.cards.scrollTo(currentIndex);
        }

        this.view.update({
            flippable,
            locked: locked && !this.view.cards.animating
        });
        this.view.cards.lock(locked);

        if (!locked) {
            this.view.skipTimer.reset();
        }
    }

    showInfoPanel() {
        this.showInfo = true;
        this.updateView();
    }

    next() {
        this.model.next();
    }

    previous() {
        this.model.previous();
    }

    toggleFlip() {
        const CardCtrl = this.CardCtrls[this.model.currentIndex];

        return CardCtrl.toggleFlip();
    }

    getSnapCardIndex(index) {
        const { model: { currentIndex, deck } } = this;
        const startIndex = Math.min(currentIndex, index) + 1;
        const endIndex = Math.max(currentIndex, index);
        const subDeck = deck.slice(startIndex, endIndex);

        if (index < currentIndex) {
            subDeck.reverse();
        }

        if (subDeck.some(card => !!card.hasSkipControl)) {
            return deck.indexOf(find(subDeck, card => !!card.hasSkipControl));
        }

        return index;
    }
}