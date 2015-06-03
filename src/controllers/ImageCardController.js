import CardController from './CardController.js';

export default class ImageCardController extends CardController {
    constructor() {
        super(...arguments);
    }

    render() {
        super();
        this.view.loadEmbed(this.model.embedCode);
    }
}
