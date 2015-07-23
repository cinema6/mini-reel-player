import PlayerController from '../PlayerController.js';
import FullPlayerView from '../../views/full/FullPlayerView.js';
import FullArticleCardController from './FullArticleCardController.js';
import FullTextCardController from './FullTextCardController.js';
import FullImageCardController from './FullImageCardController.js';
import FullVideoCardController from './FullVideoCardController.js';
import FullRecapCardController from './FullRecapCardController.js';
import FullPrerollCardController from './FullPrerollCardController.js';
import DisplayAdCardController from '../DisplayAdCardController.js';
import FullInstagramCardController from './FullInstagramCardController.js';
import PlaylistPlayerController from '../../mixins/PlaylistPlayerController.js';
import ResizingPlayerController from '../../mixins/ResizingPlayerController.js';

export default class FullPlayerController extends PlayerController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullPlayerView());

        this.CardControllers = {
            article: FullArticleCardController,
            text: FullTextCardController,
            image: FullImageCardController,
            video: FullVideoCardController,
            recap: FullRecapCardController,
            preroll: FullPrerollCardController,
            displayAd: DisplayAdCardController,
            instagram: FullInstagramCardController
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
