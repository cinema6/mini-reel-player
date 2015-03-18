import TemplateView from '../../lib/core/TemplateView.js';
import View from '../../lib/core/View.js';
import Hidable from '../mixins/Hideable.js';

export default class DisplayAdView extends TemplateView {
    constructor() {
        super(...arguments);

        this.tag = 'div';
        this.classes.push('companionAd__group');
        this.template = require('./DisplayAdView.html');
        this.instantiates = {View};
    }
}
DisplayAdView.mixin(Hidable); // jshint ignore:line
