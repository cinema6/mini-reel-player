import ApplicationController from '../ApplicationController.js';
import MobilePlayerController from './MobilePlayerController.js';

export default class MobileApplicationController extends ApplicationController {
    constructor() {
        super(...arguments);

        require('../../animations/mobile.js');
        this.PlayerCtrl = new MobilePlayerController(this.appView);
    }
}
