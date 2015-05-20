import ApplicationController from '../ApplicationController.js';
import FullNPPlayerController from './FullNPPlayerController.js';

export default class FullNPApplicationController extends ApplicationController {
    constructor() {
        super(...arguments);

        this.PlayerCtrl = new FullNPPlayerController(this.appView);
    }
}
