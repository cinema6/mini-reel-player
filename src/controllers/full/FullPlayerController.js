import PlayerController from '../PlayerController.js';
import FullPlayerView from '../../views/full/FullPlayerView.js';
import FullTextCardController from './FullTextCardController.js';
import FullVideoCardController from './FullVideoCardController.js';
import FullRecapCardController from './FullRecapCardController.js';
import PlaylistPlayerController from '../../mixins/PlaylistPlayerController.js';
import ResizingPlayerController from '../../mixins/ResizingPlayerController.js';

export default class FullPlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullPlayerView());

        this.CardControllers = {
            text: FullTextCardController,
            video: FullVideoCardController,
            recap: FullRecapCardController
        };

        this.initResizing();
        this.initPlaylist();
    }

    updateView() {
        this.view.update({ splash: this.minireel.splash });
        return super(...arguments);
    }
}
FullPlayerController.mixin(PlaylistPlayerController, ResizingPlayerController); // jshint ignore:line
