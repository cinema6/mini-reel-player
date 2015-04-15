import TemplateView from '../../lib/core/TemplateView.js';
import Hideable from '../mixins/Hideable.js';

export default class BallotResultsView extends TemplateView {
    constructor() {
        super(...arguments);

        this.tag = 'div';
    }
}
BallotResultsView.mixin(Hideable); // jshint ignore:line
