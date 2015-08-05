import FacebookCardController from '../FacebookCardController.js';
import FullFacebookArticleCardView from '../../views/full/FullFacebookArticleCardView.js';

export default class FullFacebookArticleCardController extends FacebookCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullFacebookArticleCardView());
    }
}
