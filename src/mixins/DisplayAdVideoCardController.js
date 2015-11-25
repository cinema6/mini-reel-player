import DisplayAdController from '../controllers/DisplayAdController.js';

function DisplayAdVideoCardController() {}
DisplayAdVideoCardController.prototype = {
    initDisplayAd: function() {
        const displayAd = this.model.modules.displayAd;
        if (!displayAd) { return; }

        const DisplayAdCtrl = this.DisplayAdCtrl = new DisplayAdController(displayAd);

        this.model.on('activate', () => DisplayAdCtrl.activate());
        this.model.on('deactivate', () => DisplayAdCtrl.deactivate());
    },

    render: function() {
        this.view.update({ hasDisplayAd: !!this.model.modules.displayAd });
        if (this.DisplayAdCtrl) { this.DisplayAdCtrl.renderInto(this.view.displayAdOutlet); }

        return this.super();
    }
};

export default DisplayAdVideoCardController;
