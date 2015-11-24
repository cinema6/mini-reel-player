import PlayerController from '../PlayerController.js';
import SoloPlayerView from '../../views/solo/SoloPlayerView.js';
import SoloVideoCardController from './SoloVideoCardController.js';
import LightboxPrerollCardController from '../lightbox/LightboxPrerollCardController.js';

export default class SoloPlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.CardControllers = {
            video: SoloVideoCardController,
            preroll: LightboxPrerollCardController
        };

        this.view = new SoloPlayerView();
    }
}
