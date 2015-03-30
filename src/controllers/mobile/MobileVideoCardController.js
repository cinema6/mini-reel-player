import VideoCardController from '../VideoCardController.js';
import MobileVideoCardView from '../../views/mobile/MobileVideoCardView.js';

export default class MobileVideoCardController extends VideoCardController {
    constructor() {
        super(...arguments);

        this.view = new MobileVideoCardView();

        this.addListeners();
    }

    addListeners() {
        super();

        /* Module events. */
        const {
            displayAd: DisplayAdCtrl
        } = this.moduleControllers;
        const { player } = this;

        if (DisplayAdCtrl) {
            DisplayAdCtrl.on('activate', () => {
                this.view.playerOutlet.hide();
                this.view.replayContainer.show();
            });
            DisplayAdCtrl.on('deactivate', () => {
                this.view.playerOutlet.show();
                this.view.replayContainer.hide();
            });
        }

        /* Player events. */
        player.on('play', () => {
            if (DisplayAdCtrl) { DisplayAdCtrl.deactivate(); }
        });
        player.on('ended', () => {
            const { displayAd } = this.model.modules;

            if (displayAd && !displayAd.isDefault) {
                DisplayAdCtrl.activate();
            }

            if (this.canAutoadvance()) { this.model.complete(); }
        });

        /* View events. */
        this.view.on('replay', () => {
            if (DisplayAdCtrl) {
                DisplayAdCtrl.deactivate();
            }
        });
    }

    canAutoadvance() {
        const { displayAd } = this.model.modules;

        return super() && (!displayAd || displayAd.isDefault);
    }
}
