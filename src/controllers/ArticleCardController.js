import CardController from './CardController.js';

export default class ArticleCardController extends CardController {
    constructor() {
        super(...arguments);
        this.model.on('prepare', () => { this.renderArticle(); });
        this.model.on('activate', () => { this.renderArticle(); });
    }

    renderArticle() {
        this.view.update({
            src: this.model.data.src
        });
    }
}
