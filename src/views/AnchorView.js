import ButtonView from './ButtonView.js';

export default class AnchorView extends ButtonView {
    constructor() {
        super(...arguments);

        this.tag = 'a';
    }
}
