import ArticleCardController from '../ArticleCardController.js';
import MobileArticleCardView from '../../views/mobile/MobileArticleCardView.js';

export default class MobileArticleCardController extends ArticleCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobileArticleCardView());
    }

    advance() {
        this.model.complete();
    }
}
