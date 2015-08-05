import CardController from './CardController.js';

export default class FacebookCardController extends CardController {

    constructor() {
        super(...arguments);
        this.isRendered = false;

        const doRender = () => {
            if(!this.isRendered) {
                this.renderFacebook();
            }
        };

        this.model.on('prepare', doRender);
        this.model.on('activate', doRender);
    }

    renderFacebook() {
    }
}
