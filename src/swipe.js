import './main.js';

import Runner from '../lib/Runner.js';
import SwipeApplicationController from './controllers/swipe/SwipeApplicationController.js';

Runner.run(() => new SwipeApplicationController(document.body));
