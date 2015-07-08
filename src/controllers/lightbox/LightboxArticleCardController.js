import ArticleCardController from '../ArticleCardController.js';
import LightboxArticleCardView from '../../views/lightbox/LightboxArticleCardView.js';

export default class LightboxArticleCardController extends ArticleCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightboxArticleCardView());
    }
}
