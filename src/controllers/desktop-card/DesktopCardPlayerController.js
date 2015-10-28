import CardPlayerController from '../CardPlayerController.js';
import DesktopCardVideoCardController from './DesktopCardVideoCardController.js';
import DesktopCardPlayerView from '../../views/desktop-card/DesktopCardPlayerView.js';
import LightArticleCardController from '../light/LightArticleCardController.js';
import LightInstagramImageCardController from '../light/LightInstagramImageCardController.js';
import LightInstagramVideoCardController from '../light/LightInstagramVideoCardController.js';

export default class DesktopCardPlayerController extends CardPlayerController {
    constructor(rootView) {
        super(rootView);

        this.CardControllers = {
            article: LightArticleCardController,
            video: DesktopCardVideoCardController,
            instagramImage: LightInstagramImageCardController,
            instagramVideo: LightInstagramVideoCardController
        };

        this.view = new DesktopCardPlayerView();
    }
}
