import './main.js';
import Runner from '../lib/Runner.js';
import MobileCardApplicationController from
    './controllers/mobile-card/MobileCardApplicationController.js';

Runner.run(() => new MobileCardApplicationController(document.body));
