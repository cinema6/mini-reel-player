import PlayerController from '../PlayerController.js';
import SoloPlayerView from '../../views/solo/SoloPlayerView.js';
import SoloImageCardController from './SoloImageCardController.js';
import SoloVideoCardController from './SoloVideoCardController.js';
import FullPrerollCardController from '../full/FullPrerollCardController.js';

export default class SoloPlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.CardControllers = {
            image: SoloImageCardController,
            video: SoloVideoCardController,
            preroll: FullPrerollCardController
        };

        this.view = new SoloPlayerView();
    }
}
