import ViewController from '../controllers/ViewController.js';
import ModalShareView from '../views/ModalShareView.js';

function ModalShareController() {}
ModalShareController.prototype = {
    initShare: function() {
        const sizes = {
            facebook: {
                w: 570,
                h: 550
            },
            twitter: {
                w: 580,
                h: 250
            },
            pinterest: {
                w: 750,
                h: 550
            }
        };
        const ShareCtrl = this.ShareCtrl = new ViewController(this.model);
        this.model.on('deactivate', () => this.hideShare());
        ShareCtrl.view = this.ShareCtrl.addView(new ModalShareView());
        ShareCtrl.close = () => this.hideShare();
        ShareCtrl.shareItemClicked = (shareItem, shareLink) => {
            let w = sizes[shareLink.type].w;
            let h = sizes[shareLink.type].h;
            let left = (screen.width/2)-(w/2);
            let top = (screen.height/2)-(h/2)-50;
            return window.open(shareLink.href, shareLink.type,
                `width=${w}, height=${h}, top=${top}, left=${left}`);
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
