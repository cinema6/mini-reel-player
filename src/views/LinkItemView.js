import TemplateView from '../../lib/core/TemplateView.js';
import ContextualView from '../mixins/ContextualView.js';

export default class LinkItemView extends TemplateView {
    click() {
        return this.sendAction(this);
    }
}
LinkItemView.mixin(ContextualView);
