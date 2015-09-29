import ModalShareView from '../views/ModalShareView.js';
import {createKey} from 'private-parts';

class Private {
    constructor(instance) {
        this.__public__ = instance;
        this.shown = false;
        this.shareView = null;
    }

    updateView() {
        if(!this.shareView) { return; }

        if(this.shown) {
            this.__public__.player.pause();
            if(this.__public__.view.playerOutlet) {
                this.__public__.view.playerOutlet.hide();
            }
            this.shareView.show();
            this.__public__.emit('openedModal');
        } else {
            this.shareView.hide();
            if(this.__public__.view.playerOutlet) {
                this.__public__.view.playerOutlet.show();
            }
            this.__public__.emit('closedModal');
        }
    }
}

const _ = createKey(instance => new Private(instance));

function ModalShareVideoCardController() {
    if (global.__karma__) { this.__private__ = _(this); }
}
ModalShareVideoCardController.prototype = {
    initShare: function() {
        _(this).shareView = this.addView(new ModalShareView());
        this.model.on('deactivate', () => this.hideShare());
    },

    render: function() {
        this.super();
        const shareView = _(this).shareView;
        if (shareView && this.view.shareOutlet) {
            shareView.update({
                shareLinks: this.model.shareLinks
            });
            this.view.shareOutlet.append(shareView);
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

export default ModalShareVideoCardController;
