import ApplicationController from '../ApplicationController.js';
import LightPlayerController from './LightPlayerController.js';

export default class LightApplicationController extends ApplicationController {
    constructor() {
        super(...arguments);

        this.PlayerCtrl = new LightPlayerController(this.appView);
    }
}
