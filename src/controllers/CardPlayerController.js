import Controller from '../../lib/core/Controller.js';
import MiniReel from '../models/MiniReel.js';

export default class CardPlayerController extends Controller {
    constructor(rootView) {
        super();

        this.CardControllers = {};

        this.minireel = new MiniReel();
        this.CardCtrl = null;

        this.minireel.once('init', () => {
            const card = this.minireel.deck[0];

            rootView.append(this.view);

            this.CardCtrl = new this.CardControllers[card.type](card, this.view.cardOutlet);
            this.CardCtrl.render();
        });
    }
}
