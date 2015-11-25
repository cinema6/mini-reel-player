import ImageCardController from '../ImageCardController.js';
import LightboxPlaylistVideoCardView from
    '../../views/lightbox-playlist/LightboxPlaylistVideoCardView.js';

export default class LightboxPlaylistImageCardController extends ImageCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightboxPlaylistVideoCardView());
    }
}
