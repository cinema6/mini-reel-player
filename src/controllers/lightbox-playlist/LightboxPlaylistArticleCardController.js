import ArticleCardController from '../ArticleCardController.js';
import LightboxPlaylistArticleCardView from
    '../../views/lightbox-playlist/LightboxPlaylistArticleCardView.js';

export default class LightboxPlaylistArticleCardController extends ArticleCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightboxPlaylistArticleCardView());
    }
}
