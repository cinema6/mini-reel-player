import InstagramCardController from '../InstagramCardController.js';
import MobileInstagramCardView from '../../views/mobile/MobileInstagramCardView.js';
import InstagramEmbedView from '../../views/image_embeds/InstagramEmbedView.js';
import { createKey } from 'private-parts';

const _ = createKey();

export default class MobileInstagramVideoCardController extends InstagramCardController {
    constructor() {
        super(...arguments);

        _(this).embedView = null;
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
        _(this).embedView = embedView;
    }

    deactivate() {
        _(this).embedView.remove();
        _(this).embedView = null;
        this.isRendered = false;
    }
}
