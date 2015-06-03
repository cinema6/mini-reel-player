import ImageCardView from '../ImageCardView.js';
import View from '../../../lib/core/View.js';

export default class FullImageCardView extends ImageCardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullImageCardView.html');
        this.instantiates = {View: View};
    }
}
