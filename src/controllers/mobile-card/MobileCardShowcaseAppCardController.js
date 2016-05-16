import ShowcaseAppCardController from '../ShowcaseAppCardController.js';
import MobileCardShowcaseAppCardView from
    '../../views/mobile-card/MobileCardShowcaseAppCardView.js';

export default class MobileCardShowcaseAppCardController extends ShowcaseAppCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobileCardShowcaseAppCardView());
        this.view.once('created', () => {
            const {
                view: { slides }
            } = this;

            slides.on('click', () => this.model.clickthrough('Action', 'carousel'));
            slides.on('swipe', () => this.model.goToIndex(slides.currentIndex));
            slides.once('swipe', () => this.model.stopAdvancing());
        });
    }

    updateView() {
        const { view, model } =  this;

        super.updateView(...arguments);

        if (model.currentIndex !== view.slides.currentIndex) {
            view.slides.scrollTo(model.currentIndex);
        }
    }
}
