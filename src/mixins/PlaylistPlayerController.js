import PlaylistViewController from '../controllers/PlaylistViewController.js';

function PlaylistPlayerController() {}
PlaylistPlayerController.prototype = {
    initPlaylist: function() {
        this.PlaylistViewCtrl = new PlaylistViewController(this.minireel);

        this.minireel.once('init', () => {
            this.PlaylistViewCtrl.renderInto(this.view.playlistOutlet);
        });
        this.minireel.on('becameUnskippable', () => this.PlaylistViewCtrl.disable());
        this.minireel.on('becameSkippable', () => this.PlaylistViewCtrl.enable());
        this.minireel.on('move', () => {
            const { currentCard } = this.minireel;
            if (!currentCard) { return; }
            const { type } = currentCard;

            if (type === 'recap') {
                this.view.expand();
                this.PlaylistViewCtrl.hide();
            } else {
                this.view.contract();
                this.PlaylistViewCtrl.show();
            }
        });
    }
};

export default PlaylistPlayerController;
