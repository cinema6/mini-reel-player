import ButtonView from './ButtonView.js';
import Hideable from '../mixins/Hideable.js';

export default class LightboxNavButtonView extends ButtonView {}
LightboxNavButtonView.mixin(Hideable); // jshint ignore:line
