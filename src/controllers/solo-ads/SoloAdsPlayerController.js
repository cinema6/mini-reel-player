import PlayerController from '../PlayerController.js';
import SoloPlayerView from '../../views/solo/SoloPlayerView.js';
import SoloAdsVideoCardController from './SoloAdsVideoCardController.js';
import LightboxPrerollCardController from '../lightbox/LightboxPrerollCardController.js';

export default class SoloAdsPlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.CardControllers = {
            video: SoloAdsVideoCardController,
            preroll: LightboxPrerollCardController
        };

        this.view = new SoloPlayerView();
    }
}
