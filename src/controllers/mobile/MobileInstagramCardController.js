import InstagramCardController from '../InstagramCardController.js';
import MobileInstagramCardView from '../../views/mobile/MobileInstagramCardView.js';
import InstagramEmbedView from '../../views/image_embeds/InstagramEmbedView.js';

export default class MobileInstagramCardController extends InstagramCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobileInstagramCardView());
    }

    renderInstagram() {
        this.isRendered = true;
        if (!this.view.embedOutlet) {
            this.view.create();
        }

        const embedView = new InstagramEmbedView();
        embedView.update({
            href: this.model.data.href,
            caption: this.model.caption
        });
        this.view.embedOutlet.append(embedView);
    }
}
