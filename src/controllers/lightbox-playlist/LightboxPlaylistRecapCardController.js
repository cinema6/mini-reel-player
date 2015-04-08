import RecapCardController from '../RecapCardController.js';
import LightboxPlaylistRecapCardView
    from '../../views/lightbox-playlist/LightboxPlaylistRecapCardView.js';

export default class LightboxPlaylistRecapCardController extends RecapCardController {
    constructor() {
        super(...arguments);

        this.view = new LightboxPlaylistRecapCardView();

        this.addListeners();
    }
}
