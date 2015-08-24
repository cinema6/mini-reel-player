import CardView from './CardView.js';
import InstagramCaptionView from './InstagramCaptionView.js';
import LinksListView from './LinksListView.js';

export default class InstagramCardView extends CardView {
    constructor() {
        super(...arguments);

        this.instantiates = { InstagramCaptionView, LinksListView };
    }

    update(data) {
        super(data);
        if(data.sponsored) {
            if(data.links && data.links.length > 0) {
                this.links.update(data.links);
                if(this.linksSmall) {
                    this.linksSmall.update(data.links);
                }
            }
        }
    }
}
