import './main.js';
import Runner from '../lib/Runner.js';
import LightApplicationController from './controllers/light/LightApplicationController.js';
import CardView from './views/CardView.js';
import ResizingCardView from './mixins/ResizingCardView.js';

CardView.mixin(ResizingCardView);

Runner.run(() => new LightApplicationController(document.body));
