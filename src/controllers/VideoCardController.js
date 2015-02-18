import CardController from './CardController.js';
import VideoCardView from '../views/VideoCardView.js';

export default class VideoCardController extends CardController {
    constructor() {
        super(...arguments);

        this.view = new VideoCardView();
    }

    render() {
        this.view.update({
            source: this.model.data.source,
            href: this.model.data.href
        });

        return super(...arguments);
    }
}
