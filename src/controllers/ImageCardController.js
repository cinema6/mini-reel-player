import CardController from './CardController.js';
import FlickrEmbedView from '../views/image_embeds/FlickrEmbedView.js';
import GettyEmbedView from '../views/image_embeds/GettyEmbedView.js';
import WebEmbedView from '../views/image_embeds/WebEmbedView.js';

export default class ImageCardController extends CardController {
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

    appendEmbedView(embedView) {
        if (!this.view.playerOutlet) {
            this.view.create();
        }

        this.view.playerOutlet.append(embedView);
        const data = this.model.data;
        embedView.update({
            src: data.src,
            width: data.width,
            height: data.height,
            imageid: data.imageid
        });
    }

    renderImage() {
        this.isRendered = true;
        switch(this.model.data.service) {
        case 'flickr':
            const flickrEmbedView = new FlickrEmbedView();
            this.appendEmbedView(flickrEmbedView);
            break;
        case 'getty':
            const gettyEmbedView = new GettyEmbedView();
            this.appendEmbedView(gettyEmbedView);
            break;
        case 'web':
            const webEmbedView = new WebEmbedView();
            this.appendEmbedView(webEmbedView);
        }
        this.view.update({
            href: this.model.data.href,
            source: this.model.data.source,
            showSource: (this.model.data.service !== 'web')
        });
    }

}
