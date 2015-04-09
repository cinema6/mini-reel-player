function DisplayAdVideoCardController() {}
DisplayAdVideoCardController.prototype = {
    initDisplayAd: function() {
        const { displayAd: DisplayAdCtrl } = this.moduleControllers;
        if (!DisplayAdCtrl) { return; }

        this.model.on('activate', () => DisplayAdCtrl.activate());
        this.model.on('deactivate', () => DisplayAdCtrl.deactivate());
    },

    render: function() {
        this.view.update({ hasDisplayAd: !!this.model.modules.displayAd });
        return this.super();
    }
};

export default DisplayAdVideoCardController;
