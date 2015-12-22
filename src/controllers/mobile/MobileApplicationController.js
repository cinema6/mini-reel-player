import ApplicationController from '../ApplicationController.js';
import MobilePlayerController from './MobilePlayerController.js';
//import '../../animations/mobile.js';

export default class MobileApplicationController extends ApplicationController {
    constructor() {
        super(...arguments);

        this.PlayerCtrl = new MobilePlayerController(this.appView);
    }
}
