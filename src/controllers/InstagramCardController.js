import CardController from './CardController.js';

export default class InstagramCardController extends CardController {
    constructor() {
        super(...arguments);
        this.isRendered = false;

        const doRender = () => {
            if(!this.isRendered) {
                this.renderImage();
            }
        };

        this.model.on('prepare', doRender);
        this.model.on('activate', doRender);
    }

    renderImage() {
        this.isRendered = true;
    }

}
