import FacebookCardController from '../FacebookCardController.js';
import LightFacebookArticleCardView from '../../views/light/LightFacebookArticleCardView.js';

export default class LightFacebookArticleCardController extends FacebookCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightFacebookArticleCardView());
    }
}
