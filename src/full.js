import './main.js';
import Runner from '../lib/Runner.js';
import FullApplicationController from './controllers/full/FullApplicationController.js';
import CardView from './views/CardView.js';
import ResizingCardView from './mixins/ResizingCardView.js';
import AnimatedCardView from './mixins/AnimatedCardView.js';

CardView.mixin(ResizingCardView, AnimatedCardView);

Runner.run(() => new FullApplicationController(document.body));
