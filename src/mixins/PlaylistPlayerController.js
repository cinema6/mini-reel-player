import PlaylistViewController from '../controllers/PlaylistViewController.js';
import DisplayAdController from '../controllers/DisplayAdController.js';

function PlaylistPlayerController() {}
PlaylistPlayerController.prototype = {
    initPlaylist: function() {
        this.PlaylistViewCtrl = new PlaylistViewController(this.minireel);
        this.DisplayAdCtrl = new DisplayAdController();

        this.minireel.once('init', () => {
            this.PlaylistViewCtrl.renderInto(this.view.playlistOutlet);
            this.DisplayAdCtrl.renderInto(this.view.displayAdOutlet);

            this.PrerollCardCtrl.on('showingCompanion', () => this.PlaylistViewCtrl.contract());
            this.PrerollCardCtrl.model.on('deactivate', () => this.PlaylistViewCtrl.expand());
        });
        this.minireel.on('becameUnskippable', () => this.PlaylistViewCtrl.disable());
        this.minireel.on('becameSkippable', () => this.PlaylistViewCtrl.enable());
        this.minireel.on('move', () => {
            const { currentCard } = this.minireel;
            if (!currentCard) { return; }
            const { type, modules: { displayAd } } = currentCard;

            if (displayAd) {
                this.DisplayAdCtrl.model = displayAd;
                this.DisplayAdCtrl.activate();
            } else {
                this.DisplayAdCtrl.deactivate();
            }

            if (type === 'recap') {
                this.view.expand();
                this.PlaylistViewCtrl.hide();
            } else {
                this.view.contract();
                this.PlaylistViewCtrl.show();
            }
        });

        this.DisplayAdCtrl.on('activate', () => this.PlaylistViewCtrl.contract());
        this.DisplayAdCtrl.on('deactivate', () => this.PlaylistViewCtrl.expand());
    }
};

export default PlaylistPlayerController;
