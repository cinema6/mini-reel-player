import RecapCardItemView from '../RecapCardItemView.js';
import {
    noop
} from '../../../lib/utils.js';

export default class MobileRecapCardItemView extends RecapCardItemView {
    constructor() {
        super(...arguments);

        this.template = require('./MobileRecapCardItemView.html');
        this.classes.push('recap__item', 'card__group', 'clearfix');
    }

    didCreateElement() {
        this.element.onclick = noop;
        return super(...arguments);
    }
}
