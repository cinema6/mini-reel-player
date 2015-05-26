import PlayerController from '../PlayerController.js';
import FullNPPlayerView from '../../views/full-np/FullNPPlayerView.js';
import FullTextCardController from '../full/FullTextCardController.js';
import FullVideoCardController from '../full/FullVideoCardController.js';
import FullRecapCardController from '../full/FullRecapCardController.js';
import FullPrerollCardController from '../full/FullPrerollCardController.js';
import DisplayAdCardController from '../DisplayAdCardController.js';
import ResizingPlayerController from '../../mixins/ResizingPlayerController.js';
import ThumbnailNavigatorPlayerController from '../../mixins/ThumbnailNavigatorPlayerController.js';

export default class FullPlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullNPPlayerView());

        this.CardControllers = {
            text: FullTextCardController,
            video: FullVideoCardController,
            recap: FullRecapCardController,
            preroll: FullPrerollCardController,
            displayAd: DisplayAdCardController
        };

        this.initResizing();
        this.initThumbnailNavigator();
    }

    updateView() {
        this.view.update({ splash: this.minireel.splash });
        return super(...arguments);
    }
}
FullPlayerController.mixin(ThumbnailNavigatorPlayerController, ResizingPlayerController); // jshint ignore:line
