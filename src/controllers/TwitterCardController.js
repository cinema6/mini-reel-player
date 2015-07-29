import CardController from './CardController.js';

export default class TwitterCardController extends CardController {
    constructor() {
        super(...arguments);
        this.isRendered = false;

        const doRender = () => {
            if(!this.isRendered) {
                this.renderTweet();
            }
        };

        this.model.on('prepare', doRender);
        this.model.on('activate', doRender);
    }

    renderTweet() {
        this.isRendered = true;
        this.view.update({
        });
    }
}
