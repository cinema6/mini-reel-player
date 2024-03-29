import CardView from './CardView.js';
import InstagramCaptionView from './InstagramCaptionView.js';
import LinksListView from './LinksListView.js';
import LinkItemView from './LinkItemView.js';

export default class InstagramCardView extends CardView {
    constructor() {
        super(...arguments);

        this.instantiates = {InstagramCaptionView, LinksListView, LinkItemView};
    }
}
