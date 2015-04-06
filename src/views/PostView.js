import TemplateView from '../../lib/core/TemplateView.js';
import ButtonView from './ButtonView.js';
import Hideable from '../mixins/Hideable.js';

export default class PostView extends TemplateView {
    constructor() {
        super(...arguments);

        this.tag = 'div';
        this.classes.push('actionsModal__group', 'player__height');
        this.template = require('./PostView.html');

        this.instantiates = {ButtonView};
    }
}
PostView.mixin(Hideable); // jshint ignore:line
