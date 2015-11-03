import CardPlayerController from '../CardPlayerController.js';
import DesktopCardVideoCardController from './DesktopCardVideoCardController.js';
import DesktopCardPlayerView from '../../views/desktop-card/DesktopCardPlayerView.js';
import LightArticleCardController from '../light/LightArticleCardController.js';
import DesktopCardInstagramImageCardController from './DesktopCardInstagramImageCardController.js';
import DesktopCardInstagramVideoCardController from './DesktopCardInstagramVideoCardController.js';

export default class DesktopCardPlayerController extends CardPlayerController {
    constructor(rootView) {
        super(rootView);

        this.CardControllers = {
            article: LightArticleCardController,
            video: DesktopCardVideoCardController,
            instagramImage: DesktopCardInstagramImageCardController,
            instagramVideo: DesktopCardInstagramVideoCardController
        };

        this.view = this.addView(new DesktopCardPlayerView());
    }
}
