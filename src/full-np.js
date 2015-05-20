import './main.js';
import Runner from '../lib/Runner.js';
import FullNPApplicationController from './controllers/full-np/FullNPApplicationController.js';
import CardView from './views/CardView.js';
import ResizingCardView from './mixins/ResizingCardView.js';

CardView.mixin(ResizingCardView);

Runner.run(() => new FullNPApplicationController(document.body));
