import DisplayAdView from '../views/DisplayAdView.js';
import { createKey } from 'private-parts';

const _ = createKey();

function CompanionPrerollCardController() {
    _(this).hasCompanion = false;
}
CompanionPrerollCardController.prototype = {
    initCompanion: function() {
        this.companion = new DisplayAdView();

        this.player.on('companionsReady', () => {
            const [companion] = this.player.getCompanions();

            _(this).hasCompanion = true;

            this.companion.populateWith(() => {
                switch (companion.adType) {
                case 'iframe':
                    return `<iframe src="${companion.fileURI}" scrolling="no"></iframe>`;
                case 'image':
                    return `<img src="${companion.fileURI}" />`;
                case 'html':
                    return companion.fileURI;
                }
            }());
            this.companion.show();

            if (this.model.active) {
                this.emit('showingCompanion');
            }
        });

        this.model.on('activate', () => {
            if (_(this).hasCompanion) { this.emit('showingCompanion'); }
        });
        this.model.on('deactivate', () => {
            _(this).hasCompanion = false;
            this.companion.hide();
        });
    },

    renderInto: function(view) {
        this.super(view);
        this.companion.hide();
        this.companion.appendTo(this.view.companionOutlet);
    }
};

export default CompanionPrerollCardController;
