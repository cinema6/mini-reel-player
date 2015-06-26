import PlayerController from '../PlayerController.js';
import SoloPlayerView from '../../views/solo/SoloPlayerView.js';
import SoloAdsImageCardController from './SoloAdsImageCardController.js';
import SoloAdsVideoCardController from './SoloAdsVideoCardController.js';
import FullPrerollCardController from '../full/FullPrerollCardController.js';

export default class SoloAdsPlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.CardControllers = {
            image: SoloAdsImageCardController,
            video: SoloAdsVideoCardController,
            preroll: FullPrerollCardController
        };

        this.view = new SoloPlayerView();
    }
}
