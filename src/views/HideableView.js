import View from '../../lib/core/View.js';
import Hidable from '../mixins/Hideable.js';

export default class HideableView extends View {}
HideableView.mixin(Hidable); // jshint ignore:line
