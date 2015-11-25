import ApplicationController from '../ApplicationController.js';
import SoloAdsPlayerController from './SoloAdsPlayerController.js';

export default class SoloAdsApplicationController extends ApplicationController {
    constructor() {
        super(...arguments);

        this.PlayerCtrl = new SoloAdsPlayerController(this.appView);
    }
}
