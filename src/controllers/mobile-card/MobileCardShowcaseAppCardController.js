import ShowcaseAppCardController from '../ShowcaseAppCardController.js';
import MobileCardShowcaseAppCardView from
    '../../views/mobile-card/MobileCardShowcaseAppCardView.js';
import Runner from '../../../lib/Runner.js';

export default class MobileCardShowcaseAppCardController extends ShowcaseAppCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobileCardShowcaseAppCardView());
        this.view.once('created', () => {
            const {
                view: { slides },
                model: { currentIndex }
            } = this;

            slides.currentIndex = currentIndex;

            slides.on('click', () => this.model.clickthrough('Action', 'carousel'));
            slides.on('swipe', () => this.model.goToIndex(slides.currentIndex));
            slides.once('swipe', () => this.model.stopAdvancing());
        });
    }

    updateView() {
        const { view, model } =  this;
        const { slides } = view;
        const scroll = () => slides.scrollTo(model.currentIndex);

        super.updateView(...arguments);

        if (model.currentIndex !== view.slides.currentIndex) {
            if (slides.inserted) {
                scroll();
            } else {
                slides.once('refresh', () => Runner.runNext(scroll));
            }
        }
    }
}
