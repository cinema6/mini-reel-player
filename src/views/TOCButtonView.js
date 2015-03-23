import ButtonView from './ButtonView.js';
import Hideable from '../mixins/Hideable.js';

export default class TOCButtonView extends ButtonView {}
TOCButtonView.mixin(Hideable); // jshint ignore:line
