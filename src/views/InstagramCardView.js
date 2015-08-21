import CardView from './CardView.js';
import InstagramCaptionView from './InstagramCaptionView.js';
import LinksListView from './LinksListView.js';
import View from '../../lib/core/View.js';

export default class InstagramCardView extends CardView {
    constructor() {
        super(...arguments);

        this.instantiates = { InstagramCaptionView, LinksListView };
    }

    update(data) {
        super(data);
        const sponsoredClass = 'instag____card__group--sponsored';
        const view = new View(this.element.firstElementChild);
        if(data.sponsored) {
            view.addClass(sponsoredClass);
            if(data.links && data.links.length > 0) {
                this.links.update(data.links);
                if(this.linksSmall) {
                    this.linksSmall.update(data.links);
                }
            }
        } else {
            view.removeClass(sponsoredClass);
        }
    }
}
