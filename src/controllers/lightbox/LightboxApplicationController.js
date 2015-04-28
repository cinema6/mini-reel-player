import ApplicationController from '../ApplicationController.js';
import LightboxPlayerController from './LightboxPlayerController.js';

export default class LightboxApplicationController extends ApplicationController {
    constructor() {
        super(...arguments);

        this.PlayerCtrl = new LightboxPlayerController(this.appView);
    }
}
