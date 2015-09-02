import ActionableItemView from './ActionableItemView';
import { createKey } from 'private-parts';

export default class ModalShareItemView extends ActionableItemView {
    constructor() {
        super(...arguments);
    }

    update(data) {
        super(data);
        this.addClass('socialBtn__bg--' + data.type);
        this.addClass('socialIconsBe__light--' + data.type);
    }
}
