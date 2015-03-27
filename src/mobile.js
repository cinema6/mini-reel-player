import './main.js';

import Runner from '../lib/Runner.js';
import MobileApplicationController from './controllers/mobile/MobileApplicationController.js';

Runner.run(() => new MobileApplicationController(document.body));
