import TemplateView from '../../lib/core/TemplateView.js';
import Hideable from '../mixins/Hideable.js';

export default class SkipTimerView extends TemplateView {
    constructor() {
        super(...arguments);

        this.template = require('./SkipTimerView.html');
    }

    update(time) {
        return super({
            remaining: time.toString()
        });
    }
}
SkipTimerView.mixin(Hideable); // jshint ignore:line
