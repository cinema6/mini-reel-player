import View from '../../lib/core/View.js';

export default class PlayerPosterView extends View {
    constructor() {
        super(...arguments);

        this.tag = 'div';
    }

    setImage(src) {
        this.setAttribute('style', (src || false) && `background-image:url("${src}")`);
    }
}
