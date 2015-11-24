import ArticleCardController from '../ArticleCardController.js';
import FullNPArticleCardView from '../../views/full-np/FullNPArticleCardView.js';

export default class FullNPArticleCardController extends ArticleCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullNPArticleCardView());
    }
}
