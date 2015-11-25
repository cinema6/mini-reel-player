import ArticleCardController from '../ArticleCardController.js';
import LightArticleCardView from '../../views/light/LightArticleCardView.js';

export default class LightArticleCardController extends ArticleCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightArticleCardView());
    }
}
