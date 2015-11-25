import TextCardController from '../TextCardController.js';
import SwipeTextCardView from '../../../src/views/swipe/SwipeTextCardView.js';

export default class SwipeTextCardController extends TextCardController {
    constructor(card, meta, deck) {
        super(card, deck);

        this.view = this.addView(new SwipeTextCardView());

        this.flippable = false;
    }
}
