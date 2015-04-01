import ButtonView from './ButtonView.js';
import Hideable from '../mixins/Hideable.js';
import {createKey} from 'private-parts';

const _ = createKey();

export default class ResizableNavButtonView extends ButtonView {
    constructor() {
        super(...arguments);

        _(this).previousSize = null;
    }

    setSize(size) {
        const classname = (size => `slideNav__btn--${size}`);
        const { previousSize } = _(this);

        if (previousSize) { this.removeClass(classname(previousSize)); }
        this.addClass(classname(size));

        _(this).previousSize = size;
    }
}
ResizableNavButtonView.mixin(Hideable); // jshint ignore:line
