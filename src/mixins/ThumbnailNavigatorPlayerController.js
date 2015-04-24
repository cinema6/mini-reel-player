import ThumbnailNavigatorViewController from '../controllers/ThumbnailNavigatorViewController.js';

function ThumbnailNavigatorPlayerController() {}
ThumbnailNavigatorPlayerController.prototype = {
    initThumbnailNavigator: function() {
        this.ThumbnailNavigatorViewCtrl = new ThumbnailNavigatorViewController(this.minireel);

        this.minireel.once('init', () => {
            this.ThumbnailNavigatorViewCtrl.renderInto(this.view.pagerOutlet);
        });
        this.minireel.on('move', () => {
            if (!this.minireel.currentCard) { return; }
            const { currentCard: { type } } = this.minireel;

            if ((/^(text|recap|displayAd)$/).test(type)) {
                this.ThumbnailNavigatorViewCtrl.expand();
            } else {
                this.ThumbnailNavigatorViewCtrl.contract();
            }

            if (type === 'recap') {
                this.ThumbnailNavigatorViewCtrl.hideThumbs();
            } else {
                this.ThumbnailNavigatorViewCtrl.showThumbs();
            }
        });
    }
};

export default ThumbnailNavigatorPlayerController;
