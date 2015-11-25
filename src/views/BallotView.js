import TemplateView from '../../lib/core/TemplateView.js';
import ButtonView from './ButtonView.js';
import Hideable from '../mixins/Hideable.js';

export default class BallotView extends TemplateView {
    constructor() {
        super(...arguments);

        this.tag = 'div';
        this.classes.push('ballot__group', 'player__height', 'playerHeight');
        this.template = require('./BallotView.html');
        this.instantiates = {ButtonView};
    }
}
BallotView.mixin(Hideable); // jshint ignore:line
