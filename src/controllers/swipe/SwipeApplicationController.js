import ApplicationController from '../ApplicationController.js';
import SwipePlayerController from './SwipePlayerController.js';

export default class SwipeApplicationController extends ApplicationController {
    constructor() {
        super(...arguments);

        this.PlayerCtrl = new SwipePlayerController(this.appView);
    }
}
