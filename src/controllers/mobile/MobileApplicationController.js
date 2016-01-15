import ApplicationController from '../ApplicationController.js';
import MobilePlayerController from './MobilePlayerController.js';

/* #if isMiniReel */
import '../../animations/mobile.js';
/* #endif */

export default class MobileApplicationController extends ApplicationController {
    constructor() {
        super(...arguments);

        this.PlayerCtrl = new MobilePlayerController(this.appView);
    }
}
