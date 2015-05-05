import VideoCard from './VideoCard.js';
import { createKey } from 'private-parts';

const _ = createKey();

export default class SlideshowBobCard extends VideoCard {
    constructor(card) {
        super(...arguments);

        _(this).card = card;
    }

    getSrc() {
        return JSON.stringify(_(this).card.data.slides);
    }
}
