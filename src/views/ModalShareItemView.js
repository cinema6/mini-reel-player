import LinkItemView from './LinkItemView.js';
import { createKey } from 'private-parts';

const _ = createKey();

export default class ModalShareItemView extends LinkItemView {
    constructor() {
        super(...arguments);

        _(this).classes = [];
    }

    update(data) {
        super.update(data);
        while(_(this).classes.length > 0) {
            const clss = _(this).classes.pop();
            this.removeClass(clss);
        }
        const classes = [
            'socialBtn__bg--' + data.type,
            'socialIconsBe__light--' + data.type
        ];
        classes.forEach(clss => {
            this.addClass(clss);
            _(this).classes.push(clss);
        });
    }
}
