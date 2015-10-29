import Controller from '../../lib/core/Controller.js';
import MiniReel from '../models/MiniReel.js';
import {
    forEach
} from '../../lib/utils.js';

export default class CardPlayerController extends Controller {
    constructor(rootView) {
        super();

        this.CardControllers = {};

        this.minireel = new MiniReel();
        this.CardCtrl = null;

        this.skipTime = 0;

        this.minireel.once('init', () => {
            const card = this.minireel.deck[0];

            rootView.append(this.view);

            this.CardCtrl = new this.CardControllers[card.type](card, this.view.cardOutlet);
            this.CardCtrl.render();
        });

        forEach([
            'becameSkippable', 'becameUnskippable',
            'becameCloseable', 'becameUncloseable'
        ], event => this.minireel.on(event, () => this.updateView()));
        this.minireel.on('skippableProgress', remaining => {
            this.skipTime = remaining;
            this.updateView();
        });
    }

    updateView() {
        const { skippable, closeable, standalone } = this.minireel;
        const { skipTime } = this;

        this.view.update({
            skippable, skipTime,
            closeable: !standalone && closeable
        });
    }

    close() {
        this.minireel.close();
    }
}
