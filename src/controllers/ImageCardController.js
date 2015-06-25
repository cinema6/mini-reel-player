import CardController from './CardController.js';
import FlickrEmbedView from '../views/image_embeds/FlickrEmbedView.js';
import GettyEmbedView from '../views/image_embeds/GettyEmbedView.js';

export default class ImageCardController extends CardController {
    constructor() {
        super(...arguments);
    }

    appendEmbedView(embedView) {
        this.view.imageOutlet.append(embedView);
        const data = this.model.data;
        embedView.update({
            href: data.href,
            width: data.width,
            height: data.height,
            imageid: data.imageid
        });
    }

    render() {
        super(...arguments);
        switch(this.model.data.service) {
            case 'flickr':
                const flickrEmbedView = new FlickrEmbedView();
                this.appendEmbedView(flickrEmbedView);
                break;
            case 'getty':
                const gettyEmbedView = new GettyEmbedView();
                this.appendEmbedView(gettyEmbedView);
                break;
        }
    }
}
