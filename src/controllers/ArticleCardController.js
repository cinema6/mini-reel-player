import CardController from './CardController.js';

export default class ArticleCardController extends CardController {
    render() {
        super(...arguments);
        this.view.update({
            src: this.model.data.src
        });
    }
}
