import ViewController from '../controllers/ViewController.js';
import ModalShareView from '../views/ModalShareView.js';
import {createKey} from 'private-parts';

class Private {
    constructor(instance) {
        this.__public__ = instance;
        this.shown = false;
        this.ShareCtrl = null;
    }

    updateView() {
        if(!this.ShareCtrl) { return; }

        if(this.shown) {
            this.__public__.player.pause();
            if(this.__public__.view.playerOutlet) {
                this.__public__.view.playerOutlet.hide();
            }
            this.ShareCtrl.view.show();
        } else {
            this.ShareCtrl.view.hide();
            if(this.__public__.view.playerOutlet) {
                this.__public__.view.playerOutlet.show();
            }
        }
    }
}

const _ = createKey(instance => new Private(instance));

function ModalShareController() {
    if (global.__karma__) { this.__private__ = _(this); }
}
ModalShareController.prototype = {
    initShare: function() {
        const ShareCtrl = _(this).ShareCtrl = new ViewController(this.model);
        this.model.on('deactivate', () => this.hideShare());
        ShareCtrl.view = ShareCtrl.addView(new ModalShareView());
        ShareCtrl.close = () => this.hideShare();
        ShareCtrl.shareItemClicked = (shareItem, shareLink) => {
            this.shareItemClicked(shareItem, shareLink);
        };
    },

    render: function() {
        this.super();
        const ShareCtrl = _(this).ShareCtrl;
        if (ShareCtrl && this.view.shareOutlet) {
            ShareCtrl.view.update({
                shareLinks: this.model.shareLinks
            });
            this.view.shareOutlet.append(ShareCtrl.view);
        }
        _(this).updateView();
    },

    showShare: function() {
        _(this).shown = true;
        _(this).updateView();
    },

    hideShare: function() {
        _(this).shown = false;
        _(this).updateView();
    }
};

export default ModalShareController;
