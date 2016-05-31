import ShowcaseCardController from './ShowcaseCardController.js';
import {
    map,
    extend
} from '../../lib/utils.js';
import timer from '../../lib/timer.js';

export default class ShowcaseAppCardController extends ShowcaseCardController {
    constructor() {
        super(...arguments);

        this.showDescription = this.model.data.showDescription;

        this.model.on('move', () => this.updateView());
        this.model.on('activate', () => {
            const {
                showDescription,
                model: { data: { autoHideDescription } }
            } = this;

            if (showDescription && autoHideDescription) {
                timer.wait(autoHideDescription).then(() => this.setShowDescription(null, false));
            }
        });
    }

    setShowDescription(checkbox, checked) {
        this.showDescription = checked;
        this.updateView();
    }

    updateView() {
        const {
            slides,
            currentIndex,
            data: { rating, price },
            links: { Action }
        } = this.model;
        const {
            showDescription
        } = this;

        this.view.update({
            showDescription,
            rating,
            price,
            slides: map(slides, (slide, index) => extend(slide, {
                id: slide.uri,
                previous: index === (currentIndex - 1),
                active: index === currentIndex,
                next: index === (currentIndex + 1),
                clickthrough: Action.uri
            }))
        });

        return super.updateView(...arguments);
    }
}
