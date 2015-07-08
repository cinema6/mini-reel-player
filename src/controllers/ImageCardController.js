import CardController from './CardController.js';
import FlickrEmbedView from '../views/image_embeds/FlickrEmbedView.js';
import GettyEmbedView from '../views/image_embeds/GettyEmbedView.js';

export default class ImageCardController extends CardController {
    constructor() {
        super(...arguments);
        this.model.on('prepare', () => { this.renderImage(); });
        this.model.on('activate', () => { this.renderImage(); });
    }

    appendEmbedView(embedView) {
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
        let viewUpdate = { };
        switch(this.model.data.service) {
        case 'flickr':
            viewUpdate.source = 'Flickr';
            viewUpdate.href = 'https://www.flickr.com';
            break;
        case 'getty':
            viewUpdate.source = 'GettyImages';
            viewUpdate.href = 'http://www.gettyimages.com';
            break;
        default:
            viewUpdate.source = 'unknown';
            viewUpdate.href = '';
        }
        this.view.update(viewUpdate);
    }

}
