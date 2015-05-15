import TemplateView from '../../lib/core/TemplateView.js';
import Hideable from '../mixins/Hideable.js';

export default class SkipTimerView extends TemplateView {
    update(time) {
        return super({
            remaining: time.toString()
        });
    }

    didCreateElement() {
        super();

        this.update('...');
    }
}
SkipTimerView.mixin(Hideable); // jshint ignore:line
