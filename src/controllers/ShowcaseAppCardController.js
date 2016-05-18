import ShowcaseCardController from './ShowcaseCardController.js';
import {
    map,
    extend
} from '../../lib/utils.js';

export default class ShowcaseAppCardController extends ShowcaseCardController {
    constructor() {
        super(...arguments);

        this.model.on('move', () => this.updateView());
    }

    updateView() {
        const {
            slides,
            currentIndex,
            data: { rating, price },
            links: { Action }
        } = this.model;

        this.view.update({
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
