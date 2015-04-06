import PlayerController from '../PlayerController.js';
import FullPlayerView from '../../views/full/FullPlayerView.js';
import FullTextCardController from './FullTextCardController.js';
import FullVideoCardController from './FullVideoCardController.js';
import FullRecapCardController from './FullRecapCardController.js';
import PlaylistViewController from '../PlaylistViewController.js';
import DisplayAdController from '../DisplayAdController.js';

export default class FullPlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullPlayerView());

        this.PlaylistViewCtrl = new PlaylistViewController(this.minireel);
        this.DisplayAdCtrl = new DisplayAdController();

        this.CardControllers = {
            text: FullTextCardController,
            video: FullVideoCardController,
            recap: FullRecapCardController
        };

        this.minireel.once('init', () => {
            this.PlaylistViewCtrl.renderInto(this.view.playlistOutlet);
            this.DisplayAdCtrl.renderInto(this.view.displayAdOutlet);
        });
        this.minireel.on('becameUnskippable', () => this.PlaylistViewCtrl.disable());
        this.minireel.on('becameSkippable', () => this.PlaylistViewCtrl.enable());
        this.minireel.on('move', () => {
            const { currentCard } = this.minireel;
            if (!currentCard) { return; }
            const {  title, note, type, modules: { displayAd } } = currentCard;

            if (displayAd) {
                this.DisplayAdCtrl.model = displayAd;
                this.DisplayAdCtrl.activate();
            } else {
                this.DisplayAdCtrl.deactivate();
            }

            if (type === 'text') {
                this.view.hideNavigation();
            } else {
                this.view.showNavigation();
            }

            if (type === 'recap') {
                this.view.expand();
                this.PlaylistViewCtrl.hide();
            } else {
                this.view.contract();
                this.PlaylistViewCtrl.show();
            }

            const length = (title || '').length + (note || '').length;

            if (length <= 100) {
                this.view.setButtonSize('small');
            } else if (length <= 200) {
                this.view.setButtonSize('med');
            } else {
                this.view.setButtonSize('large');
            }
        });

        this.DisplayAdCtrl.on('activate', () => this.PlaylistViewCtrl.contract());
        this.DisplayAdCtrl.on('deactivate', () => this.PlaylistViewCtrl.expand());
    }

    updateView() {
        this.view.update({ splash: this.minireel.splash });
        return super(...arguments);
    }
}
