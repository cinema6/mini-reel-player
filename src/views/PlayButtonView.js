import ButtonView from './ButtonView.js';
import Hideable from '../mixins/Hideable.js';

export default class PlayButtonView extends ButtonView {
    constructor() {
        super(...arguments);

        this.classes.push('player__playBtn');
        this.template = require('./PlayButtonView.html');
    }
}
PlayButtonView.mixin(Hideable);
