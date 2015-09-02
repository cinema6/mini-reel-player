import ViewController from '../controllers/ViewController.js';
import ModalShareView from '../views/ModalShareView.js';

function ModalShareController() {}
ModalShareController.prototype = {
    initShare: function() {
        const ShareCtrl = this.ShareCtrl = new ViewController(this.model);
        this.model.on('deactivate', () => this.hideShare());
        ShareCtrl.view = this.ShareCtrl.addView(new ModalShareView());
        ShareCtrl.close = () => this.hideShare();
        ShareCtrl.shareItemClicked = (shareItem, shareLink) => {
            this.shareItemClicked(shareItem, shareLink);
        };
    },

    render: function() {
        this.super();
        if (this.ShareCtrl && this.view.shareOutlet) {
            this.ShareCtrl.view.update({
                shareLinks: this.model.shareLinks
            });
            this.view.shareOutlet.append(this.ShareCtrl.view);
            this.hideShare();
        }
    },

    showShare: function() {
        if(this.ShareCtrl) {
            this.player.pause();
            this.view.playerOutlet.hide();
            this.ShareCtrl.view.show();
        }
    },

    hideShare: function() {
        if(this.ShareCtrl) {
            this.ShareCtrl.view.hide();
            this.view.playerOutlet.show();
        }
    }
};

export default ModalShareController;
