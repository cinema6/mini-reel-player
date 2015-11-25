import PlayerController from '../PlayerController.js';
import SoloPlayerView from '../../views/solo/SoloPlayerView.js';
import SoloVideoCardController from './SoloVideoCardController.js';

export default class SoloPlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.CardControllers = {
            video: SoloVideoCardController
        };

        this.view = new SoloPlayerView();
    }
}
