import SkipTimerView from '../SkipTimerView.js';
import TemplateView from '../../../lib/core/TemplateView.js';
import { createKey } from 'private-parts';

const _ = createKey();

export default class SkipProgressTimerView extends SkipTimerView {
    constructor() {
        super(...arguments);

        _(this).maxTime = null;
    }

    update(time) {
        const isNumber = !isNaN(time);

        if (!isNumber) {
            _(this).maxTime = null;
        }

        if (isNumber && _(this).maxTime === null) {
            _(this).maxTime = time;
        }

        const { maxTime } = _(this);
        const width = isNumber ? `${Math.max(((time - 1) / maxTime) * 100, 0)}%` : `100%`;

        TemplateView.prototype.update.call(this, { width });

        return super(time);
    }

    reset() {
        this.update('...');
    }
}
