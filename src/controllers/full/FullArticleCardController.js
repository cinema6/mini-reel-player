import ArticleCardController from '../ArticleCardController.js';
import FullArticleCardView from '../../views/full/FullArticleCardView.js';

export default class FullArticleCardController extends ArticleCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullArticleCardView());
    }

    advance() {
        this.model.complete();
    }
}
