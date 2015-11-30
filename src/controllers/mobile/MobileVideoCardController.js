import VideoCardController from '../VideoCardController.js';
import MobileVideoCardView from '../../views/mobile/MobileVideoCardView.js';
import DisplayAdController from '../DisplayAdController.js';
import InlineBallotResultsVideoCardController
    from '../../mixins/InlineBallotResultsVideoCardController.js';
import ModalShareVideoCardController from '../../mixins/ModalShareVideoCardController.js';

export default class MobileVideoCardController extends VideoCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobileVideoCardView());

        const { player, model: { modules: { displayAd } } } = this;
        if (displayAd && !displayAd.isDefault) {
            const DisplayAdCtrl = this.DisplayAdCtrl = new DisplayAdController(displayAd);

            DisplayAdCtrl.on('activate', () => {
                this.view.playerOutlet.hide();
                this.view.replayContainer.show();
            });
            DisplayAdCtrl.on('deactivate', () => {
                this.view.playerOutlet.show();
                this.view.replayContainer.hide();
            });

            player.on('play', () => DisplayAdCtrl.deactivate());
            player.on('ended', () => DisplayAdCtrl.activate());
        }

        this.initBallotResults();
        this.initShare();
    }

    replay() {
        if (this.DisplayAdCtrl) { this.DisplayAdCtrl.deactivate(); }
        return super.replay();
    }

    canAutoadvance() {
        const { displayAd } = this.model.modules;
        return super.canAutoadvance() && (!displayAd || displayAd.isDefault);
    }

    render() {
        super.render(...arguments);
        if (this.DisplayAdCtrl) { this.DisplayAdCtrl.renderInto(this.view.displayAdOutlet); }
    }
}
MobileVideoCardController.mixin(InlineBallotResultsVideoCardController, ModalShareVideoCardController); // jshint ignore:line
