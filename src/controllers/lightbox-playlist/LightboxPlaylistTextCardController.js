import TextCardController from '../TextCardController.js';
import LightboxPlaylistTextCardView
    from '../../views/lightbox-playlist/LightboxPlaylistTextCardView.js';

export default class LightboxPlaylistTextCardController extends TextCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightboxPlaylistTextCardView());
    }

    advance() {
        this.model.complete();
    }
}
