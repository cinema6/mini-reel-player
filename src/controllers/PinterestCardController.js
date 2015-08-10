import CardController from './CardController.js';

export default class PinterestCardController extends CardController {
    constructor() {
        super(...arguments);
        this.isRendered = false;

        const doRender = () => {
            if(!this.isRendered) {
                this.renderArticle();
            }
        };

        this.model.on('prepare', doRender);
        this.model.on('activate', doRender);
    }

    renderArticle() {
        this.isRendered = true;
        this.view.update({
        });
    }
}
