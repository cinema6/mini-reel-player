import ApplicationController from '../ApplicationController.js';
import LightboxPlaylistPlayerController from './LightboxPlaylistPlayerController.js';

export default class LightboxPlaylistApplicationController extends ApplicationController {
    constructor() {
        super(...arguments);

        this.PlayerCtrl = new LightboxPlaylistPlayerController(this.appView);
    }
}
