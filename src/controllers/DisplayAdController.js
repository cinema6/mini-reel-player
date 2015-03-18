import ModuleController from './ModuleController.js';
import DisplayAdView from '../views/DisplayAdView.js';
import adtech from '../services/adtech.js';

export default class DisplayAdController extends ModuleController {
    constructor() {
        super(...arguments);

        this.view = new DisplayAdView();
    }

    activate() {
        const { view, model } = this;

        if (!view.adContainer) {
            this.view.create();
        }

        adtech.load({ placement: model.placement, adContainerId: view.adContainer.id });

        return super();
    }
}
