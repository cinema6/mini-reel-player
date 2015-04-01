import './main.js';
import Runner from '../lib/Runner.js';
import FullApplicationController from './controllers/full/FullApplicationController.js';
import CardView from './views/CardView.js';
import ResizingCard from './mixins/ResizingCard.js';

CardView.mixin(ResizingCard);

Runner.run(() => new FullApplicationController(document.body));
