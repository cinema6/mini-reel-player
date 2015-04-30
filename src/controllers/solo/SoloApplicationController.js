import ApplicationController from '../ApplicationController.js';
import SoloPlayerController from './SoloPlayerController.js';

export default class SoloApplicationController extends ApplicationController {
    constructor() {
        super(...arguments);

        this.PlayerCtrl = new SoloPlayerController(this.appView);
    }
}
