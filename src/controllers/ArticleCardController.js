import CardController from './CardController.js';

export default class ArticleCardController extends CardController {
    constructor() {
        super(...arguments);
        this.isRendered = false;
        this.model.on('prepare', () => {
            if(!this.isRendered) {
                this.renderArticle();
            }
        });
        this.model.on('activate', () => {
            if(!this.isRendered) {
                this.renderArticle();
            }
        });
    }

    renderArticle() {
        this.isRendered = true;
        this.view.update({
            src: this.model.data.src
        });
    }
}
