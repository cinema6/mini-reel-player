import ActionableItemView from './ActionableItemView';

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
