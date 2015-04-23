import TemplateView from '../../lib/core/TemplateView.js';
import View from '../../lib/core/View.js';
import Hidable from '../mixins/Hideable.js';
import Runner from '../../lib/Runner.js';

function populateAdContainer(html) {
    this.adContainer.element.innerHTML = html;
}

export default class DisplayAdView extends TemplateView {
    constructor() {
        super(...arguments);

        this.tag = 'div';
        this.classes.push('companionAd__group');
        this.template = require('./DisplayAdView.html');
        this.instantiates = {View};
    }

    populateWith(html) {
        if (!this.adContainer) { this.create(); }
        Runner.scheduleOnce('render', this, populateAdContainer, [html]);
    }
}
DisplayAdView.mixin(Hidable); // jshint ignore:line
