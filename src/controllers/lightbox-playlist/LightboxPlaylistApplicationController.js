import ApplicationController from '../ApplicationController.js';
import LightboxPlaylistPlayerController from './LightboxPlaylistPlayerController.js';
import browser from '../../services/browser.js';
import codeLoader from '../../services/code_loader.js';

export default class LightboxPlaylistApplicationController extends ApplicationController {
    constructor() {
        super(...arguments);

        this.PlayerCtrl = new LightboxPlaylistPlayerController(this.appView);

        browser.test('mouse').then(hasMouse => {
            if (hasMouse) { codeLoader.loadStyles('css/lightbox-playlist--hover.css'); }
        });
    }
}
