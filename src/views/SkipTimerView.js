import TemplateView from '../../lib/core/TemplateView.js';
import Hideable from '../mixins/Hideable.js';

export default class SkipTimerView extends TemplateView {
    update(time) {
        return super.update({
            remaining: time.toString()
        });
    }

    didCreateElement() {
        super.didCreateElement();

        this.update('...');
    }
}
SkipTimerView.mixin(Hideable); // jshint ignore:line
