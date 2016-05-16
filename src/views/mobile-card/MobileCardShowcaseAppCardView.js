import CardView from '../CardView.js';
import LinkItemView from '../LinkItemView.js';
import CarouselView from '../CarouselView.js';
import StarRatingView from '../StarRatingView.js';

export default class MobileCardShowcaseAppCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./MobileCardShowcaseAppCardView.html');
        this.instantiates = { LinkItemView, CarouselView, StarRatingView };
    }
}
