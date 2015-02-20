import ButtonView from './ButtonView.js';
import Hideable from '../mixins/Hideable.js';

class CloseButtonView extends ButtonView {}
CloseButtonView.mixin(Hideable);

export default CloseButtonView;
