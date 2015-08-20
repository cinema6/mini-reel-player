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
            const element = this.element.firstElementChild;
            const sponsoredClass = 'instag____card__group--sponsored';
            if(element.className.indexOf(sponsoredClass) === -1) {
                element.className = element.className + ' ' + sponsoredClass;
            }
            if(data.links && data.links.length > 0) {
                this.links.update(data.links);
                this.linksSmall.update(data.links);
            }
        }
    }
}
