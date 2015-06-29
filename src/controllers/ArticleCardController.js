import CardController from './CardController.js';

export default class ArticleCardController extends CardController {
    constructor() {
        super(...arguments);
    }

    render() {
        super(...arguments);
        this.view.update({
            src: this.model.data.src
        });
    }
}
